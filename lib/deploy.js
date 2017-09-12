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
	 * @param {string} [opts.from=process.cwd()] - Source folder
	 * @param {string} opts.to - Deploy folder
	 * @param {Gulp} [opts.gulp]
	 */
	constructor(opts){

		// Set defaults
		process.env.PRTL_ENV = process.env.PRTL_ENV || env.DEV;

		this.opts = {
			'from': process.cwd(),
			'to': '',
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

		if(this.opts.gulp){

			require('./private/deploylog').attachToGulp(this.opts.gulp);
		}
	};

	/**
	 * Copy the folder `opts.from` into `opts.to`
	 *
	 * - excludes certain files like .git, node_modules etc.
	 * - writes an revision.json containing the product name, timestamp and
	 * dependencies
	 *
	 * @return {Promise}
	 */
	assemble(){
		return require('./private/assemble')({
			from: this.opts.from,
			to: this.opts.to,
		});
	};

	/**
	 * Copy the configuration from `opts.from` into `opts.to`.
	 *
	 * It expects a folder structure like this:
	 * - Deploy/Config/Development
	 * - Deploy/Config/Live
	 * - Deploy/Config/Staging
	 * - Deploy/Config/Testing
	 *
	 * The Live config is always copied, the environment specific folder only
	 * if `process.env.PRTL_ENV` is set and differs from `Poduction` or `Live`
	 *
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
	 * Install composer dependencies in the `opts.from` folder.
	 * @return {Promise}
	 */
	composer(){
		return require('@studyportals/composer').install({
			cwd: this.opts.from
		});
	};

	/**
	 * Prepares the deploy location
	 *
	 * It makes sure the folder exists and is empty.
	 *
	 * @return {Promise}
	 */
	prepare(){
		return require('./private/prepare').ensureEmptyDir(this.opts.to)
	};

	/**
	 * workingCopy deploy.
	 *
	 * - prepare
	 * - composer
	 * - assemble
	 * - copy configuration
	 * - compile sass
	 * - compile js
	 *
	 * @return {Promise}
	 */
	workingCopy(){

		return this.prepare()
			.then(() => {return this.composer(); })
			.then(() => {return this.assemble(); })
			.then(() => {return this.configure(); })
			.then(() => {return _sass(this.to, this.enableCompression); })
			.then(() => {return _js(this.to, this.enableCompression); })
	};

	/**
	 * Start the file watchers
	 *
	 * - js
	 * - scss
	 * - file
	 */
	startWatchers(){

		_js_watcher(this.opts.gulp, this.to, this.enableCompression);
		_css_watcher(this.opts.gulp, this.to, this.enableCompression);
		_file_watcher(this.opts.gulp, this.to);
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