"use strict";

const env = require('./env');
const log = require('@studyportals/node-log');
const sass = require('./sass');
const path = require('path');

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
	 */
	constructor(opts){

		// Set defaults
		process.env.PRTL_ENV = process.env.PRTL_ENV || env.DEV;

		this.opts = {
			'cwd': process.cwd(),
			'gulp': null,
		};
		Object.assign(this.opts, opts);

		let valid_envs = Object.keys(env).map(function(key){
			return env[key];
		});

		if(valid_envs.indexOf(process.env.PRTL_ENV) === -1){

			throw new Error(`${this.constructor.name}: Incorrect process.env.PRTL_ENV: '${process.env.PRTL_ENV}', available options: ${valid_envs.concat(', ')}`);
		}

		this.distFolder = path.resolve(this.opts.cwd, 'dist');
		this.enableCompression = process.env.PRTL_ENV === env.PRD || process.env.PRTL_ENV === env.STG;
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
	 * - Deploy/Config/<process.env.PRTL_ENV>
	 *
	 * @return {Promise}
	 */
	configure(){
		return require('./configure')({
			cwd: this.opts.cwd,
			env: process.env.PRTL_ENV
		});
	};

	/**
	 * Install composer dependencies in the `opts.from` folder.
	 * @return {Promise}
	 */
	composer(){
		return require('./composer').install({
			cwd: this.opts.cwd,
			dev: (process.env.PRTL_ENV === env.DEV)
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
	 * - file
	 *
	 * Watchers can be disabled by providing a comma separated list in the env var `PRTL_DISABLED_WATCHERS`
	 * For instance `PRTL_DISABLED_WATCHERS=file` will enable js and scss watchers but disables the file watcher.
	 *
	 * @param {Object} [opts]
	 * @param {boolean} [opts.scss=true]
	 * @param {boolean} [opts.js=true]
	 * @param {boolean} [opts.config=true]
	 *
	 * @return {undefined}
	 */
	startWatchers(opts){

		console.log(process.env.PRTL_DISABLE_WATCHERS, Boolean.parse(process.env.PRTL_DISABLE_WATCHERS));

		if(Boolean.parse(process.env.PRTL_DISABLE_WATCHERS)){

			// Nothing to watch
			return;
		}

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

			if(opts.config && filePath.startsWith(path.resolve(self.opts.from, 'Deploy', 'Config'))){

				log.info(`File changed: ${filePath}, applying config`);
				return self.configure();
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