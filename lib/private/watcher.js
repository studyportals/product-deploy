"use strict";

const path = require('path');
const glob = require('globby');
const fs = require('fs');
const log = require('@studyportals/node-log');

const chokidar = require('chokidar');

/**
 * @typedef {Object} WatcherOptions
 * @property {boolean} compress
 * @property {boolean} applyInitial
 * @property {WatcherCallbacks} callbacks
 */
/**
 * @typedef {Object} WatcherCallbacks
 * @property {function} beforeAttach
 * @property {function} afterAttach
 *
 * @see Watcher.applyToPath
 */

global.logged = false;

/**
 * Base class
 */
class Watcher{

	/**
	 * Starts a watcher after gulp has finished. The watcher then applies the code
	 * implemented in the applyToPath method.
	 * @see Watcher.applyToPath.
	 *
	 * Works only when doing a working copy.
	 *
	 * @param gulp
	 * @param buildDir the buildDir of where to put the files
	 * @param paths the glob paths to listen on
	 * @param {WatcherOptions} options
	 */
	attachToGulp(gulp, buildDir, paths, options){

		paths.push('!.idea/**/*');
		paths.push('!.git/**/*');
		paths.push('!**/*_tmp*');
		paths.push('!*_tmp*');
		paths.push('!.gitattributes');
		paths.push('!.gitignore');
		paths.push('!.gitmodules');

		let enabled = true;
		if(process.env.PRTL_DISABLED_WATCHERS){

			const disabledWatchers = process.env.PRTL_DISABLED_WATCHERS.split(',').map(x=>x.trim());

			enabled = disabledWatchers.indexOf(this.envName) == -1;
		}

		if(!global.logged){

			global.logged = true;

			console.log('Edit environmental variable PRTL_DISABLED_WATCHERS to disable specific watchers.');
			console.log('Values in this variable are separated by ',' (css,js,etc)');
		}

		if(!enabled){

			this.log(`Is disabled. To enable, remove '${this.envName}' from PRTL_DISABLED_WATCHERS.`);
			return;
		}

		this.log(`Is enabled. To disable, add '${this.envName}' to PRTL_DISABLED_WATCHERS.`);

		if(!options){

			options = {};
		}
		if(!options.callbacks){

			options.callbacks = {};
		}

		if(options.callbacks.beforeAttach){

			options.callbacks.beforeAttach();
		}

		gulp.on('stop', () =>{

			this.gulp = gulp;
			this.buildDir = buildDir;

			if(options.compress){

				this.compress = options.compress;
			}

			this.log(`Compressing is ${this.compress ? "enabled" : "disabled"}`);
			let sourceCollections = [];

			const cwd = process.cwd();
			sourceCollections.push({
				sources: paths.map(x=>{

					return Watcher._resolveGlob(x, cwd);
				}),
				base: cwd,
				origin: cwd
			});

			let listenersChain = Promise.resolve();

			sourceCollections.forEach(collection =>{

				const sources = collection.sources;
				let files = [];
				listenersChain = listenersChain.then(() =>{
					return glob(sources).then(found =>{

						files = found;
					}).then(() =>{

						if(options.applyInitial){

							this.log(`Applying to ${files.length} files under ${collection.origin}`);
							return this.applyToPath(files, sources, collection.base, collection.origin);
						}
					}).then(() =>{

						this.onAttach(files);
						this.log(`Watching ${files.length} files under ${collection.origin}`);
						chokidar.watch(sources, {ignoreInitial:true}).on('all', (event, file) =>{

							const relPath = file.replace(collection.base, '').replace(path.basename(file), '');
							let relativePath = path.resolve(this.buildDir + relPath, path.basename(file));

							let message = `[${this.constructor.name}\n  evt:${event == 'unlink' ? 'delete' : event}\n  src:${file}\n  dst:${relativePath}`;

							if(event == 'unlink' && relativePath.endsWith('scss')){

								relativePath = path.resolve(this.buildDir + relPath, path.basename(file).replace('.scss', '.css'));
								if(fs.existsSync(relativePath)){

									message += `\n  css:${relativePath}`;
								}
							}

							console.log(message + "\n]");
							if(event == 'unlink'){

								if(fs.existsSync(relativePath)){

									fs.unlinkSync(relativePath);
								}
								this.onUnlink(relativePath, relPath, file);
							}
							else{

								this.applyToPath([path.resolve(file)], undefined, collection.base, collection.origin).catch(ex =>{

									this.log(ex);
								});
							}
						});
					});
				}).catch(ex =>{

					this.log(ex.stack);
					throw ex;
				});
			});

			listenersChain = listenersChain.then(() =>{

				if(options.callbacks.afterAttach){

					options.callbacks.afterAttach();
				}

				this.log("Done");
			});
		});
	}

	/**
	 * Console.log with this.name up front.
	 *
	 * @param message
	 */
	log(message){

		console.log(`${this.constructor.name}:`, message);
	}

	/**
	 * @abstract
	 * Abstract method that defines what happens with files when they are watched.
	 *
	 * @param paths glob patterns to files/actual files
	 * @param display if has specific way to be logged as ( too many files -> display is just the pattern )
	 * @param base the location in which the files are
	 * @param origin root path of the glob from which the file originated
	 * @return {Promise}
	 */
	applyToPath(paths, display, base, origin){

		throw new Error(`NOT IMPLEMENTED ${this.constructor.name}.${this.applyToPath.name}`);
	}

	static _resolveGlob(glob, cwd){

		const negation = glob[0] == "!";
		if(negation)
			glob = glob.substring(1);

		return (negation ? "!" : "") + path.resolve(cwd, glob);
	}

	/**
	 * Handles on attaching
	 *
	 * @abstract
	 * @param files
	 */
	onAttach(files){

	}

	/**
	 * Handles on file deletion
	 *
	 * @param relativePath the path in the build dir
	 * @param relPath relative path in the source directory
	 * @param file the actual file
	 */
	onUnlink(relativePath, relPath, file){

	}

	get envName(){

		return this.constructor.name.toLowerCase().replace("watcher", "");
	}
}

module.exports = Watcher;