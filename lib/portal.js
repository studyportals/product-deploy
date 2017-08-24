"use strict";

/**
 * @type {Portal}
 */
const Portal = class Portal{
	/**
	 * @param {Object} opts
	 * @param {string} opts.to
	 * @param {string} [opts.from=current working directory]
	 * @param {string} [opts.env=Testing]
	 */
	constructor(opts){

		let env = require('./private/env');

		this.log = require('@studyportals/node-log');
		this.env = env;
		this.opts = {
			'to': '',
			'from': process.cwd(),
			'env': this.env.TST,
		};
		Object.assign(this.opts, opts);

		if(!opts.to){

			throw new Error(`Portal: opts.to is empty. Please provide a valid location.`);
		}

		let valid_envs = Object.keys(env).map(function(key) {
			return env[key];
		});

		if(valid_envs.indexOf(this.opts.env) === -1){

			throw new Error(`Portal: Incorrect opts.env: '${this.opts.env}', available options: ${valid_envs.concat(', ')}`);
		}

		this.enableCompression = this.opts.env === this.env.PRD || this.opts.env === 'Live' || this.opts.env === this.env.STG;
	};

	/**
	 * Assemble the portal into the deploy location.
	 * @return {Promise}
	 */
	assemle(){
		return require('./private/assemble')({
			from: this.opts.from,
			to: this.opts.to,
		});
	};

	/**
	 * Copy the configuration.
	 * @return {Promise}
	 */
	configure(){
		return require('./private/configure')({
			from: this.opts.from,
			to: this.opts.to,
			env: this.opts.env
		});
	};

	/**
	 * Compile scss files into css.
	 * @return {Promise}
	 */
	sass(){

		const sp_sass = require('@studyportals/sass');

		return sp_sass.compile({
			'from': [
				`${this.opts.to}/**/*.scss`,
				`!${this.opts.to}/bower_components/**/*`,
				`!${this.opts.to}/node_modules/**/*`,
			],
			to: this.opts.to,
			outputStyle: this.enableCompression ? sp_sass.OUTPUTSTYLE.COMPRESSED : sp_sass.OUTPUTSTYLE.NESTED,
		})
	};

	/**
	 * Compile js files with babel and uglifies them when enableCompression is true
	 * @return {Promise}
	 */
	js(){
		return require('./private/js').compile({
			from: [
				`${this.opts.to}/**/*.js`,
				`!${this.opts.to}/bower_components/**/*`,
				`!${this.opts.to}/node_modules/**/*`,
			],
			to: this.opts.to,
			uglify: this.opts.enableCompression
		})
	};

	/**
	 * Install composer dependencies
	 * @return {Promise}
	 */
	composer(){
		return require('@studyportals/composer').install({
			cwd: this.opts.from
		});
	};

	/**
	 * Make sure the deploy location exists and is empty.
	 * @return {Promise}
	 */
	ensureEmptyDir(){
		return require('./private/prepare').ensureEmptyDir(this.opts.to)
	};

	/**
	 * @return {Promise}
	 */
	workingCopy(){

		return this.ensureEmptyDir()
			.then(() => {return this.composer(); })
			.then(() => {return this.assemle(); })
			.then(() => {return this.configure(); })
			.then(() => {return this.sass(); })
			.then(() => {return this.js(); })
	};

	full(gulp){

		const path = require('path');

		let spici = {
			root: path.join(this.opts.from, '..'),
			env: this.opts.env,
			product: path.basename(this.opts.from)
		};

		return require('./private/spici/deploys/full').prepare(spici, gulp).catch(ex => {
			throw ex;
		});

		// TODO: safeSources
		// TODO: updateSubmodulesMainProject
		// TODO: Change this.opts.from
		// TODO: WorkingCopy Deploy
	}
};
module.exports = Portal;