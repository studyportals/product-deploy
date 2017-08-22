"use strict";

/**
 * @type {Portal}
 */
const Portal = class Portal{
	/**
	 * @param {Object} opts
	 * @param {string} [opts.from]
	 * @param {string} opts.to
	 * @param {string} [opts.env=Testing]
	 */
	constructor(opts){
		this.PD = require('../index');
		this.env = require('./env');
		this.opts = {
			'from': process.cwd(),
			'to': '',
			'env': this.env.TST,
		};
		Object.assign(this.opts, opts);
		// TODO: validate from. Existing dir
		// TODO: validate to. Not empty
		// TODO: validate env. Valid item
		this.enableCompression = this.opts.env === this.env.PRD || this.opts.env === 'Live' || this.opts.env === this.env.STG;

		console.log(this.opts);
	};

	assemle(){
		return require('./assemble')({
			from: this.opts.from,
			to: this.opts.to,
		});
	};

	configure(){
		return require('./configure')({
			from: this.opts.from,
			to: this.opts.to,
			env: this.opts.env
		});
	};

	sass(){

		const sp_sass = require('@studyportals/sass')

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


	js(){
		return require('./js').compile({
			from: [
				`${this.opts.to}/**/*.js`,
				`!${this.opts.to}/bower_components/**/*`,
				`!${this.opts.to}/node_modules/**/*`,
			],
			to: this.opts.to,
			uglify: this.opts.enableCompression
		})
	};

	composer(){
		return require('@studyportals/composer').install({
			cwd: this.opts.from
		});
	};

	ensureEmptyDir(){

		console.log(this);
		return require('./prepare').ensureEmptyDir(this.opts.to)
	};

	/**
	 * @return {Promise}
	 */
	workingCopy(){

		return this.ensureEmptyDir
			.then(this.composer)
			.then(this.assemle)
			.then(this.configure)
			.then(this.sass)
			.then(this.js)
	};
};
module.exports = Portal;