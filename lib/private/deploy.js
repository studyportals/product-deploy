"use strict";

const env = require('./env');
const log = require('@studyportals/node-log');
const sass = require('./sass');
const path = require('path');
const rimraf = require('rimraf');
const globby = require('globby');

/**
 * List of folders which should always be ignored
 * @private
 */
const globalIgnoredFolder = [
	'.idea',
	'.git',
	'dist',
	'test',
	'node_modules',
	'vendor',
	'bower_components',
];

/**
 * @type {Deploy}
 */
class Deploy{
	/**
	 * @param {Object} opts
	 * @param {string} [opts.cwd=process.cwd()] - Source folder
	 * @param {Gulp} [opts.gulp=null] - Instance of Gulp
	 * @param {String} [opts.env=process.env.PRTL_ENV || Development]
	 * @param {String} [opts.cache_location=null]
	 * @param {String} [opts.error_location=null]
	 */
	constructor(opts){

		// Set defaults
		process.env.PRTL_ENV = process.env.PRTL_ENV || env.DEV;

		if(!process.env.PRTL_FLAV){

			throw new Error('process.env.PRTL_FLAV not set ');
		}

		this.opts = {
			cwd: process.cwd(),
			gulp: null,
			env: process.env.PRTL_ENV || env.DEV,
			flav: process.env.PRTL_FLAV,
			cache_location: null,
			error_location: null,
		};
		Object.assign(this.opts, opts);

		let valid_envs = Object.keys(env).map(function(key){
			return env[key];
		});

		if(valid_envs.indexOf(this.opts.env) === -1){

			throw new Error(`${this.constructor.name}: Incorrect Deploy.opts.env: '${this.opts.env}', available options: ${valid_envs.concat(', ')}`);
		}

		this.distFolder = path.join(this.opts.cwd, 'dist');
		this.enableCompression = this.opts.env === env.PRD || this.opts.env === env.STG;
	};

	/**
	 * Get a list of ignored folders.
	 *
	 * @param {boolean} [glob=false] - Should we return the list formatted as globs?
	 * @returns {string[]}
	 * @private
	 */
	_getIgnoredFolders(glob){

		let ignores = globalIgnoredFolder.map(ignore => {return path.resolve(this.opts.cwd, ignore)});

		if(glob){

			ignores = ignores.map(ignore => {return `!${ignore}/**/*`});
		}

		return ignores;
	}

	/**
	 * Clear the dist folder.
	 *
	 * @returns {Promise}
	 */
	clearDist(){

		log.info(`Clearing dist folder...`);
		return rimraf.sync(this.distFolder);
	}

	/**
	 * Clears the cache folder `Core/Data/Cache`
	 *
	 * @param {Object} [opts]
	 * @param {String} [opts.cwd=Deploy.opts.cwd] Current working directory
	 */

	clearCache(opts){

		if(!this.opts.cache_location){

			return;
		}

		const defaults = {
			cwd: this.opts.cwd
		};
		opts = Object.assign(defaults, opts);

		log.info(`Clearing cache...`);

		return globby([path.join(this.opts.cache_location, '*'), '!.gitkeep'], opts.cwd)
			.then(function then(paths) {
				paths.map(function map(item) {
					rimraf.sync(item);
				});
			});
	}

	/**
	 * Clears the error log `Core/Data/ErrorLog`
	 *
	 * @param {Object} [opts]
	 * @param {String} [opts.cwd=Deploy.opts.cwd] Current working directory
	 */

	clearErrorLog(opts){

		if(!this.opts.error_location){

			return;
		}

		const defaults = {
			cwd: this.opts.cwd,
		};
		opts = Object.assign(defaults, opts);

		log.info(`Clearing error logs...`);

		globby([path.join(this.opts.error_location, '*'), '!.gitkeep'], opts.cwd)
			.then(function then(paths) {
				paths.map(function map(item) {
					rimraf.sync(item);
				});
			});
	}

	/**
	 * Write the revision.json into `opts.to`.
	 * @return {Promise}
	 */
	writeRevisionJson(){

		return require('./write-revision.json')({
			from: this.opts.cwd,
			to: this.opts.cwd,
		});
	}

	/**
	 * Copy the configuration from Deploy/Config/<ENV> to the root.
	 *
	 * The config for Base is always copied, after that the env specific config is copied.
	 *
	 * It expects a folder structure like this:
	 * - Deploy/Config/Production
	 * - Deploy/Config/Staging
	 * - Deploy/Config/Development
	 * - Deploy/Config/<Deploy.opts.env>
	 *
	 * @return {Promise}
	 */
	configure(){
		return require('./configure')({
			cwd: this.opts.cwd,
			env: this.opts.env,
			flav: this.opts.flav
		});
	};

	/**
	 * Install composer dependencies in the `opts.from` folder.
	 * @return {Promise}
	 */
	composer(){
		return require('./composer').install({
			cwd: this.opts.cwd,
			dev: (this.opts.env === env.DEV)
		});
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
	 * @param {Object} [opts]
	 * @param {glob[]|string} [opts.from]
	 * @param {boolean} [opts.progress=true]
	 *
	 * @return {Promise}
	 */
	sass(opts){

		const defaults = {
			'from': [
				`${this.opts.cwd}/**/*.scss`,
			],
			'progress': true
		};
		opts = Object.assign(defaults, opts);

		if(typeof opts.from === 'string'){

			opts.from = [opts.from];
		}

		opts.from = opts.from.concat(this._getIgnoredFolders(true));

		return sass.compile({
			base: this.opts.cwd,
			from: opts.from,
			to: this.distFolder,
			compress: this.enableCompression,
			progress: opts.progress,
		});
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
	 * @param {Object} [opts]
	 * @param {glob[]|string} [opts.from]
	 * @param {boolean} [opts.progress=true]
	 *
	 * @return {Promise}
	 */
	js(opts){

		const defaults = {
			'from': [
				`${this.opts.cwd}/**/*.js`,
			],
			'progress': true
		};
		opts = Object.assign(defaults, opts);

		if(typeof opts.from === 'string'){

			opts.from = [opts.from];
		}

		opts.from = opts.from.concat(this._getIgnoredFolders(true));

		return require('./js').compile({
			base: this.opts.cwd,
			from: opts.from,
			to: this.distFolder,
			uglify: this.enableCompression,
			progress: opts.progress
		});
	};

	/**
	 * Start the file watchers
	 *
	 * - js
	 * - scss
	 * - config
	 *
	 * @param {Object} [opts]
	 * @param {boolean} [opts.scss=true]
	 * @param {boolean} [opts.js=true]
	 * @param {boolean} [opts.config=true]
	 *
	 * @return {undefined}
	 */
	startWatchers(opts){

		const defaults = {
			'scss': true,
			'js': true,
			'config': true,
		};
		opts = Object.assign(defaults, opts);

		const watch = [];

		if(opts.js){

			watch.push(`${this.opts.cwd}/**/*.js`);
		}

		if(opts.scss){

			watch.push(`${this.opts.cwd}/**/*.scss`);
		}

		if(opts.config){

			watch.push(`${this.opts.cwd}/Deploy/Config/**/*`);
		}

		if(watch.length === 0){

			// Nothing to watch
			return;
		}

		const chokidar = require('chokidar');
		const self = this;

		const change = function(filePath){

			if(opts.config && filePath.startsWith(path.resolve(self.opts.cwd, 'Deploy', 'Config'))){

				log.info(`File changed: ${filePath}, applying config`);
				// The cache folder structure might be copied from configuration, so first clear the cache.
				return self.clearCache()
					.then(() =>{
						return self.configure();
					});
			}
			else if(opts.js && path.extname(filePath) === '.js'){

				log.info(`File changed: ${filePath}, compiling js`);
				return self.js({
					from: filePath,
					progress: false
				})
				.catch(exc => { throw exc; });
			}
			else if(opts.scss && path.extname(filePath) === '.scss'){

				log.info(`File changed: ${filePath}, compiling scss`);
				return sass.getReferences()
					.then(ref =>{

						const dependencies = [];

						const addDepencenciesRecursive = (deps)=>{

							deps.forEach(function(filePath){

								if(dependencies.indexOf(filePath) !== -1){

									return;
								}

								dependencies.push(filePath);

								// Se if we have more dependencies.
								const newDeps = Object.keys(ref[path.resolve(filePath)] || {});

								if(newDeps.length > 0){

									addDepencenciesRecursive(newDeps);
								}
							});
						};

						addDepencenciesRecursive([filePath]);

							return self.sass({
								from: dependencies,
								progress: (dependencies.length > 1)
							});
						})
						.then(() => {

						return sass.getReferences(false);
					})
					.catch(exc => { throw exc; });
			}
		};

		const options = {
			ignoreInitial: true,
			ignored: this._getIgnoredFolders().concat([
				function(string){
					// JetBrains temp files.
					return string.indexOf('_jb_') !== -1;
				}
			]),
			atomic: 250
		};

		if(require('is-wsl')){

			// @see https://github.com/paulmillr/chokidar/issues/532
			log.warning(`File watchers are buggy on Windows Subsystem for Linux. Use them at your own responsibility.`);
			log.info(`  Falling back to polling strategy which is a lot slower and more CPU intensive.`);
			log.info(`  Please consider using a native windows or native linux console.`);
			options.usePolling = true;
			options.interval = 2000;
		}

		chokidar.watch(watch, options)
			.on('add', change)
			.on('change', change);

		console.log(); // newline
		console.log(); // newline
		log.info(`Watchers started, use 'CTRL+c' to stop the watchers.`);
	}
}

module.exports = Deploy;
