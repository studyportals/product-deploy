"use strict";

const env = require('./private/env');
const log = require('@studyportals/node-log');
const sass = require('./private/sass');

/**
 * @type {Deploy}
 */
class Deploy{
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
	 * - Deploy/Config/Integration
	 * - Deploy/Config/Testing
	 * - Deploy/Config/Staging
	 * - Deploy/Config/Live
	 *
	 * The Live config is always copied, the environment specific folder only
	 * if `process.env.PRTL_ENV` is set and differs from `Production` or `Live`
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

		return sass.compile({
			'base': this.opts.to,
			'from': [
				`${this.opts.to}/**/*.scss`,
				`!${this.opts.to}/test/**/*`,
				`!${this.opts.to}/bower_components/**/*`,
				`!${this.opts.to}/node_modules/**/*`,
				`!${this.opts.to}/vendor/**/*`,
			],
			to: this.opts.to,
			compress: this.enableCompression,
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
	 * @return {Promise}
	 */
	js(){
		return require('./private/js').compile({
			base: this.opts.to,
			from: [
				`${this.opts.to}/**/*.js`,
				`!${this.opts.to}/test/**/*`,
				`!${this.opts.to}/bower_components/**/*`,
				`!${this.opts.to}/node_modules/**/*`,
				`!${this.opts.to}/vendor/**/*`,
			],
			to: this.opts.to,
			uglify: this.enableCompression
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
	 * @return {undefined}
	 */
	startWatchers(){

		const disabledWatchers = [];
		if(process.env.PRTL_DISABLED_WATCHERS){

			process.env.PRTL_DISABLED_WATCHERS.split(',').map(x =>{

				disabledWatchers.push(x.trim());
			});
		}

		if(disabledWatchers.length === 3){

			// All disabled, nothing to do.
			return;
		}

		const chokidar = require('chokidar');
		const gulp = this.opts.gulp;
		const path = require('path');
		const self = this;

		const ignored = [
			'.idea/',
			'.git/',
			'node_modules/',
			'vendor/',
			'bower_components/',
			'Gulpfile.js',
			'*_tmp*',
			'.gitattributes*',
			'.gitignore*',
			'.gitmodules*',
		];

		if(disabledWatchers.indexOf('js') !== -1){

			log.info(`Watching js files is disabled.`);
			ignored.push('**/*.js');
		}

		if(disabledWatchers.indexOf('scss') !== -1){

			log.info(`Watching scss files is disabled.`);
			ignored.push('**/*.scss');
		}

		if(disabledWatchers.indexOf('file') !== -1){

			log.info(`Watching files is disabled.`);
			ignored.push('**/*.scss');
		}

		const compileSass = function(filePath){

			return sass.compile({
				base: self.opts.from,
				from: filePath,
				to: self.opts.to,
				compress: self.enableCompression
			});
		};

		const change = function(filePath){

			switch(path.extname(filePath)){

				case '.js':

					log.info(`File changed: ${filePath}, compiling js`);
					return require('./private/js').compile({
						base: self.opts.from,
						from: filePath,
						to: self.opts.to,
						uglify: self.enableCompression
					});

					break;
				case '.scss':

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

							return compileSass(dependencies)
						})
						.then(() => {

							return sass.getReferences(false);
						})
						.catch(exc => { throw exc; });

					break;
				default:
					return new Promise((resolve, reject) =>{

						if(disabledWatchers.indexOf('file') !== -1){

							return Promise.resolve();
						}

						let stream = gulp.src(filePath);
						stream.pipe(gulp.dest(self.opts.to));
						stream.on('error', err => reject(err));
						stream.on('end', () =>{
							log.info(`copied: ${filePath}`);
							resolve();
						});
					});

			}
		};

		const unlink = function(filePath){

			const rimraf = require('rimraf');
			const path = require('path');

			filePath = path.resolve(self.opts.to, filePath);

			rimraf.sync(filePath);
			log.info(`removed: ${filePath}`);
		};

		chokidar.watch('.', {
			ignoreInitial: true,
			awaitWriteFinish: true,
			ignored
		})
			.on('add', change)
			.on('change', change)
			.on('unlink', unlink);

		log.info(`Watchers started, use 'CTRL+c' to stop the watchers.`);
	}
}

module.exports = Deploy;