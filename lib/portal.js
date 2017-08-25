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

	/**
	 *
	 * @param {Gulp} gulp
	 * @return {Promise}
	 */
	full(gulp){

		const path = require('path');
		const fs = require('fs');
		const fsExtra = require('fs-extra');
		const localGit = require('./private/spici/deploys/lib/git');
		const product = path.basename(this.opts.from);

		let safeSource = path.join(this.opts.from, '..', this.opts.env, product, '');

		// Overwrite the from location.
		this.opts.from = safeSource;

		return Promise.resolve()
			.then(() =>{

				return new Promise(resolve =>{

					this.log.info(`Safe folder: Deploying 'full' on '${this.opts.env}' needs a 'safe' folder`);
					this.log.debug(`Safe folder: Using '${safeSource}' as safe folder`);

					if(fs.existsSync(safeSource)){

						this.log.info("Safe folder: Old sources exist, removing");
						this.log.debug(`Safe folder: rm -rf ${safeSource}`);
						fsExtra.removeSync(safeSource);
					}

					this.log.info("Safe folder: Cloning repository into Safe folder");
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
			})
			.then(() => {

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

							this.log.debug(`set PRTL_NO_CLEANUP_ON_FULL=false to enable cleanup of sources`);
							return;
						}

						this.log.debug(`set PRTL_NO_CLEANUP_ON_FULL=true to skip cleanup of sources`);

						this.log.debug("Freeing sources folder");
						this.log.debug('chdir /');
						process.chdir(path.resolve('/'));

						this.log.info("Cleaning up");
						this.log.debug(`rm -rf ${safeSource}`);
						fsExtra.removeSync(safeSource);
					};

					// Queue a cleanup

					gulp.on('stop', () =>{

						cleanup();
						this.log.info("Deploy Procedure finished");
					});

					// Even when an exception happens, cleanup will try to pass
					process.on("beforeExit", () =>{

						cleanup();
					});

					resolve();
				});

			})
			.then(() => {
				return localGit.updateSubmodules(safeSource);
			})
			.then(() => {
				return this.workingCopy()
			});
	}
};
module.exports = Portal;