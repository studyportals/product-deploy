"use strict";

const env = require('./private/env');
const path = require('path');
const fs = require('fs');

/**
 * @type {Deploy}
 */
class Deploy {
	/**
	 * @param {Object} opts
	 * @param {string} opts.to - Deploy folder
	 * @param {string} [opts.from=process.cwd()] - Source folder
	 * @param {Gulp} [opts.gulp=null] - Instance of Gulp
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

		let valid_envs = Object.keys(env).map(function(key){
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
	 * Write the revision.json into `opts.to`.
	 * @return {Promise}
	 */
	writeRevisionJson(){

		return require('./private/write-revision.json')({
			from: this.opts.from,
			to: this.opts.to,
		});
	}

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
	 * Compile scss files into css.
	 *
	 * Takes all `*.scss` files excluding the folders:
	 * - test
	 * - bower_components
	 * - node_modules
	 * - vendor
	 *
	 * @return {Promise}
	 */
	sass(){

		const sp_sass = require('./private/sass');
		return sp_sass.compile({
			'base': this.opts.from,
			'from': [
				`${this.opts.from}/**/*.scss`,
				`!${this.opts.from}/test/**/*`,
				`!${this.opts.from}/bower_components/**/*`,
				`!${this.opts.from}/node_modules/**/*`,
				`!${this.opts.from}/vendor/**/*`,
			],
			to: this.opts.to,
			compress: this.enableCompression,
		})
	};

	/**
	 * Compile js files (babel and uglify)
	 *
	 * Takes all `*.js` files excluding the folders:
	 * - test
	 * - bower_component
	 * - node_modules
	 * - vendor
	 *
	 * First it will pipe them through babel. When `Deploy.enableCompression` is
	 * true it will also uglyfies them.
	 *
	 * @return {Promise}
	 */
	js(){
		return require('./private/js').compile({
			base: this.opts.from,
			from: [
				`${this.opts.from}/**/*.js`,
				`!${this.opts.from}/test/**/*`,
				`!${this.opts.from}/bower_components/**/*`,
				`!${this.opts.from}/node_modules/**/*`,
				`!${this.opts.from}/vendor/**/*`,
			],
			to: this.opts.to,
			uglify: this.enableCompression
		})
	};

	/**
	 * Start the file watchers
	 *
	 * - js
	 * - scss
	 * - file
	 *
	 * @return {undefined}
	 */
	startWatchers(){

		_js_watcher(this.opts.gulp, this.opts.to, this.enableCompression);
		_css_watcher(this.opts.gulp, this.opts.to, this.enableCompression);
		_file_watcher(this.opts.gulp, this.opts.to);
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
			applyInitial: false
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
			applyInitial: false
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

module.exports = Deploy;