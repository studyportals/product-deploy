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
	/**
	 * @return {Promise}
	 */
	workingCopy(){

		const assemle = () =>{
			return this.PD.assemble({
				to: this.opts.to,
			});
		};
		const configure = () =>{
			return this.PD.configure({
				to: this.opts.to,
				env: this.opts.env
			});
		};
		const sass = () =>{
			return this.PD.sass.compile({
				'from': [
					`${this.opts.to}/**/*.scss`,
					`!${this.opts.to}/bower_components/**/*`,
					`!${this.opts.to}/node_modules/**/*`,
				],
				to: this.opts.to,
				outputStyle: this.enableCompression ? this.PD.sass.OUTPUTSTYLE.COMPRESSED : this.PD.sass.OUTPUTSTYLE.NESTED,
			})
		};
		const js = () =>{
			return this.PD.js.compile({
				from: [
					`${this.opts.to}/**/*.js`,
					`!${this.opts.to}/bower_components/**/*`,
					`!${this.opts.to}/node_modules/**/*`,
				],
				to: this.opts.to,
				uglify: this.opts.enableCompression
			})
		};
		const composer = () =>{
			return this.PD.composer.install({
				cwd: this.opts.from
			});
		};

		const ensureEmptyDir = this.PD.prepare.ensureEmptyDir(this.opts.to);

		return ensureEmptyDir
			.then(composer)
			.then(assemle)
			.then(configure)
			.then(sass)
			.then(js)
	};
};
module.exports = Portal;