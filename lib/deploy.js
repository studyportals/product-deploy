"use strict";

const env = require('./private/env');
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
	 * @param {Gulp} [opts.gulp]
	 */
	constructor(opts){

		// Set defaults
		process.env.PRTL_ENV = process.env.PRTL_ENV || env.DEV;

		this.opts = {
			'to': '',
			'from': process.cwd(),
			'gulp': null,
		};
		Object.assign(this.opts, opts);

		if(!opts.to){

			throw new Error(`${this.constructor.name}: opts.to is empty. Please provide a valid location.`);
		}

		let valid_envs = Object.keys(env).map(function(key) {
			return env[key];
		});

		if(valid_envs.indexOf(process.env.PRTL_ENV) === -1){

			throw new Error(`${this.constructor.name}: Incorrect process.env.PRTL_ENV: '${process.env.PRTL_ENV}', available options: ${valid_envs.concat(', ')}`);
		}

		this.enableCompression = process.env.PRTL_ENV === env.PRD || process.env.PRTL_ENV === env.STG;
	};

	/**
	 * Assemble the portal into the deploy location.
	 * @return {Promise}
	 */
	assemble(){
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
			env: process.env.PRTL_ENV
		});
	};

	/**
	 * Install _composer dependencies
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
	prepare(){
		return require('./private/prepare').ensureEmptyDir(this.opts.to)
	};

	/**
	 * Deploy based on the current folder.
	 * @return {Promise}
	 */
	workingCopy(){

		require('./private/deploylog').attachToGulp(this.opts.gulp);

		return this.prepare()
			.then(() => {return this.composer(); })
			.then(() => {return this.assemble(); })
			.then(() => {return this.configure(); })
			.then(() => {return _sass(this.to, this.enableCompression); })
			.then(() => {return _js(this.to, this.enableCompression); })
	};

	startWatchers(){

		_js_watcher(this.gulp, this.to, this.enableCompression);
		_css_watcher(this.gulp, this.to, this.enableCompression);
		_file_watcher(this.gulp, this.to);
	}
}


/**
 * @private
 */
const _css_watcher = function(gulp, to, enableCompression){

	if(!gulp){

		return;
	}

	require('./private/watcher-scss').attachToGulp(gulp, to,
		[
			'**/*.scss',
			`!*.scss`,
			'!bower_components/**/*',
			'!node_modules/**/*'
		], {
			compress: enableCompression,
			applyInitial:false
		}
	);
};

/**
 * @private
 */
const _file_watcher = function(gulp, to){

	if(!gulp){

		return;
	}

	require('./private/watcher-files').attachToGulp(gulp, to,
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
};



/**
 * @private
 */
const _js_watcher = function(gulp, to, enableCompression){

	if(!gulp){

		return;
	}

	require('./private/watcher-js').attachToGulp(gulp, to,
		[
			`**/*.js`,
			`!*.js`,
			`!**/Framework/JavaScript/*.js`,
			`!**/Vendor/**/*.js`,
			`!Admin/**/*.js`,
			`!bower_components/**/*`,
			`!node_modules/**/*`
		], {
			compress: enableCompression,
			applyInitial: false
		}
	);
};

/**
 * Compile scss files into css.
 * @private
 * @return {Promise}
 */
const _sass = function(to, enableCompression){

	const sp_sass = require('@studyportals/sass');
	return sp_sass.compile({
		'from': [
			`${to}/**/*.scss`,
			`!${to}/bower_components/**/*`,
			`!${to}/node_modules/**/*`,
		],
		to: this.opts.to,
		outputStyle: enableCompression ? sp_sass.OUTPUTSTYLE.COMPRESSED : sp_sass.OUTPUTSTYLE.NESTED,
	})
};

/**
 * Compile js files with babel and uglifies them when enableCompression is true
 * @private
 * @return {Promise}
 */
const _js = function(to, enableCompression){
	return require('./private/js').compile({
		from: [
			`${to}/**/*.js`,
			`!${to}/test/**/*`,
			`!${to}/bower_components/**/*`,
			`!${to}/node_modules/**/*`,
		],
		to: to,
		uglify: enableCompression
	})
};

module.exports = Deploy;