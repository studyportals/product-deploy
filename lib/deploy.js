"use strict";

const env = require('./private/env');
const log = require('@studyportals/node-log');
const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const localGit = require('./private/git');

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

	/**
	 * Full deploy
	 *
	 * It will clone the repository from github and executes a fresh deploy.
	 * @return {Promise}
	 */
	full(){

		const product = path.basename(this.opts.from);

		let safeSource = path.join(this.opts.from, '..', this.opts.env, product, '');

		// Overwrite the from location.
		this.opts.from = safeSource;

		return Promise.resolve()
			.then(() =>{

				log.info(`Safe folder: Deploying 'full' on '${this.opts.env}' needs a 'safe' folder`);
				log.debug(`Safe folder: Using '${safeSource}' as safe folder`);

				return this._safeSources(safeSource, product);
			})
			.then(() => {

				return this._cleanupSafeSource(safeSource);
			})
			.then(() => {
				return localGit.updateSubmodules(safeSource);
			})
			.then(() => {
				return this.workingCopy()
			});
	}

	/**
	 * @param safeSource
	 * @private
	 * @return {Promise}
	 */
	_cleanupSafeSource(safeSource){

		if(!this.opts.gulp){

			return Promise.resolve();
		}

		return new Promise(resolve =>{

			let hasCleaned = false;
			const cleanup = () =>{

				if(hasCleaned){

					return;
				}

				hasCleaned = true;

				// Allow clean up if no variable is set or it if is 'false'
				const cleanupAllowed = !process.env.PRTL_NO_CLEANUP_ON_FULL || (process.env.PRTL_NO_CLEANUP_ON_FULL && process.env.PRTL_NO_CLEANUP_ON_FULL == "false");

				if(!cleanupAllowed){

					log.debug(`set PRTL_NO_CLEANUP_ON_FULL=false to enable cleanup of sources`);
					return;
				}

				log.debug(`set PRTL_NO_CLEANUP_ON_FULL=true to skip cleanup of sources`);

				log.debug("Freeing sources folder");
				log.debug('chdir /');
				process.chdir(path.resolve('/'));

				log.info("Cleaning up");
				log.debug(`rm -rf ${safeSource}`);
				fsExtra.removeSync(safeSource);
			};

			// Queue a cleanup

			this.opts.gulp.on('stop', () =>{

				cleanup();
				log.info("Deploy Procedure finished");
			});

			// Even when an exception happens, cleanup will try to pass
			process.on("beforeExit", () =>{

				cleanup();
			});

			resolve();
		});
	}

	/**
	 *
	 * @param safeSource
	 * @param product
	 * @private
	 * @return {Promise}
	 */
	_safeSources(safeSource, product){

		return new Promise(resolve =>{

			if(fs.existsSync(safeSource)){

				log.info("Safe folder: Old sources exist, removing");
				log.debug(`Safe folder: rm -rf ${safeSource}`);
				fsExtra.removeSync(safeSource);
			}

			log.info("Safe folder: Cloning repository into Safe folder");
			const cloneDir = path.resolve(safeSource, '..');
			localGit.clone(cloneDir, `git@github.com:studyportals/${product}`)
				.then(() =>{

					return localGit.getCurrentBranchOf(process.cwd());
				})
				.then((branch) =>{

					return localGit.checkout(safeSource, `-f ${branch}`);
				})
				.then(() =>{

					resolve(safeSource);
				})
				.catch(ex =>{

					throw ex;
				});
		});
	}
}

module.exports = Deploy;