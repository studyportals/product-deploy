"use strict";

const Watcher = require('./watcher');
const sass = require('./sass');

const fs = require('fs');
const path = require('path');

class SCSSWatcher extends Watcher {

	/**
	 * Takes the file, puts it through sass, if compress is enabled -
	 * uses compressed output then puts the compiled .scss as a .css.
	 *
	 * @inheritDoc
	 */
	applyToPath(paths, display, base, origin){

		return sass.compile({
			from: paths,
			to: this.buildDir,
			cwd: base,
			compress: this.compress,
		})
			.then(() =>{

				if(paths.length == 1 && paths[0].indexOf("*") == -1){

					this._cleanupReferencesOfFile(paths[0]);
					this._generateReferences(paths);

					const target = path.resolve(base, paths[0]);
					if(this.references[target]){

						const references = Object.keys(this.references[target]);
						if(references.length > 0){

							console.log(`Updating ${references.length} dependant files`);
							return this.applyToPath(references, references.map(x => path.relative(process.cwd(), x)), base, origin);
						}
					}
					console.log("No dependant files found");
				}
			});
	}

	_generateReferences(files){

		const node_sass = require('node-sass');

		let file = undefined;
		files.forEach(file =>{

			file = path.resolve(file);

			node_sass.renderSync({
				sourceMap: file,
				file: file,
				importer: (u, prev, done) =>{

					prev = path.resolve(prev);
					if(prev != file) return;
					let url = u;
					if(!url.endsWith(".scss")){

						url += ".scss";
					}

					const checkUrl = (original, targetDir) =>{

						let ref = original;
						// check if it is a base file
						// references to
						// _File.scss
						// File.scss
						// Can be resolved to a file that is called _File.scss
						if(path.basename(original)[0] != "_"){

							ref = path.resolve(targetDir, path.dirname(original), "_" + path.basename(original));
						}

						// Try checking for a file that is _File
						if(fs.existsSync(ref)){

							return ref;
						}

						// Try checking for a file that is exactly named
						ref = path.resolve(targetDir, original);
						if(fs.existsSync(ref)){

							return ref;
						}

						return undefined;
					};

					let ref = checkUrl(url, process.cwd());

					if(!ref){

						ref = checkUrl(url, path.dirname(file));
					}
					if(!ref){

						console.log(`[!]File ${file} has a missing import ${url}`);
					}
					else{

						ref = path.resolve(ref);
						if(!this.references[ref]){

							this.references[ref] = [];
						}
						this.references[ref][file] = 1;
					}
				}
			});
		})
	}

	onAttach(files){

		/**
		 * [X] = file that when changed will trigger [X][*] to update
		 * [X][Y] = file that is dependant on [X]
		 *
		 * @type {{Object}}
		 */
		this.references = {};

		this._generateReferences(files);

		this.log(`Found ${Object.keys(this.references).length} main files`)
	}

	_cleanupReferencesOfFile(file){

		file = path.resolve(file);

		Object.keys(this.references).forEach(ref =>{

			if(this.references[ref][file]){

				delete this.references[ref][file];
			}
		});
	}

	_cleanupReferencesFromFile(file){

		file = path.resolve(file);

		this._cleanupReferencesOfFile(file);
		this._cleanupReferencesToFile(file);
	}

	_cleanupReferencesToFile(file){

		if(this.references[file]){

			delete this.references[file];
		}
	}

	onUnlink(relativePath, relPath, file){

		relativePath = path.resolve(this.buildDir + relPath, path.basename(file).replace('.scss', '.css'));
		if(fs.existsSync(relativePath)){

			fs.unlinkSync(relativePath);
		}

		this._cleanupReferencesFromFile(file);
	}
}

module.exports = new SCSSWatcher();