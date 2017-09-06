"use strict";

const env = require('./private/env');
const log = require('@studyportals/node-log');
const path = require('path');
const fs = require('fs');

/**
 * @type {Deploy}
 */
class Deploy{
	/**
	 * @param {Object} opts
	 * @param {string} opts.to
	 * @param {string} [opts.from=current working directory]
	 * @param {string} [opts.env=Testing]
	 * @param {Gulp} [opts.gulp]
	 */
	constructor(opts){

		this.opts = {
			'to': '',
			'from': process.cwd(),
			'env': env.TST,
			'gulp': null,
		};
		Object.assign(this.opts, opts);

		if(!opts.to){

			throw new Error(`${this.constructor.name}: opts.to is empty. Please provide a valid location.`);
		}

		let valid_envs = Object.keys(env).map(function(key) {
			return env[key];
		});

		if(valid_envs.indexOf(this.opts.env) === -1){

			throw new Error(`${this.constructor.name}: Incorrect opts.env: '${this.opts.env}', available options: ${valid_envs.concat(', ')}`);
		}

		this.enableCompression = this.opts.env === env.PRD || this.opts.env === env.STG;
	};

	/**
	 * Assemble the portal into the deploy location.
	 * @private
	 * @return {Promise}
	 */
	_assemble(){
		return require('./private/assemble')({
			from: this.opts.from,
			to: this.opts.to,
		});
	};

	/**
	 * Copy the configuration.
	 * @private
	 * @return {Promise}
	 */
	_configure(){
		return require('./private/configure')({
			from: this.opts.from,
			to: this.opts.to,
			env: this.opts.env
		});
	};

	/**
	 * Compile scss files into css.
	 * @private
	 * @return {Promise}
	 */
	_sass(){

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
	 * @private
	 * @return {Promise}
	 */
	_js(){
		return require('./private/js').compile({
			from: [
				`${this.opts.to}/**/*.js`,
				`!${this.opts.to}/test/**/*`,
				`!${this.opts.to}/bower_components/**/*`,
				`!${this.opts.to}/node_modules/**/*`,
			],
			to: this.opts.to,
			uglify: this.opts.enableCompression
		})
	};

	/**
	 * Install _composer dependencies
	 * @private
	 * @return {Promise}
	 */
	_composer(){
		return require('@studyportals/composer').install({
			cwd: this.opts.from
		});
	};

	/**
	 * Make sure the deploy location exists and is empty.
	 * @private
	 * @return {Promise}
	 */
	_ensureEmptyDir(){
		return require('./private/prepare').ensureEmptyDir(this.opts.to)
	};

	/**
	 * Deploy based on the current folder.
	 * @return {Promise}
	 */
	workingCopy(){

		require('./private/deploylog').attachToGulp(this.opts.gulp);

		return this._ensureEmptyDir()
			.then(() => {return this._composer(); })
			.then(() => {return this._assemble(); })
			.then(() => {return this._configure(); })
			.then(() => {return this._sass(); })
			.then(() => {return this._js(); })
	};

	startWatchers(){

		this._js_watcher();
		this._css_watcher();
		this._file_watcher();
	}

	_js_watcher(){

		if(!this.opts.gulp){

			return;
		}

		require('./private/watcher-js').attachToGulp(this.opts.gulp, this.opts.to,
			[
				`**/*.js`,
				`!*.js`,
				`!**/Framework/JavaScript/*.js`,
				`!**/Vendor/**/*.js`,
				`!Admin/**/*.js`,
				`!bower_components/**/*`,
				`!node_modules/**/*`
			], {
				compress: this.enableCompression,
				applyInitial: false
			}
		);
	}

	_css_watcher(){

		if(!this.opts.gulp){

			return;
		}

		require('./private/watcher-scss').attachToGulp(this.opts.gulp, this.opts.to,
			[
				'**/*.scss',
				`!*.scss`,
				'!bower_components/**/*',
				'!node_modules/**/*'
			], {
				compress: this.enableCompression,
				applyInitial:false
			}
		);
	}

	_file_watcher(){

		if(!this.opts.gulp){

			return;
		}

		require('./private/watcher-files').attachToGulp(this.opts.gulp, this.opts.to,
			[
				"*.*",
				'**/*.*',
				'!**/*.js',
				'!**/*.scss',
				'!node_modules/**/*'
			], {
				applyInitial:false
			}
		);
	}
}

module.exports = Deploy;