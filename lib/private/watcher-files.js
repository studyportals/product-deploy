"use strict";

const Watcher = require('./watcher');

class FileWatcher extends Watcher {

	/**
	 * Copies the file and moves it to the build directory.
	 *
	 * @param paths glob patterns to files/actual files
	 * @param display if has specific way to be logged as ( too many files -> display is just the pattern )
	 * @param base the location in which the files are
	 * @param origin root path of the glob from which the file originated
	 * @return {Promise}
	 */
	applyToPath(paths, display, base, origin){

		return new Promise(resolve => {
			try{
				let stream = this.gulp.src(paths, {base:base});
				stream = stream.pipe(this.gulp.dest(this.buildDir));

				stream.on('end', () => {
						this.log(`Finished. Affected files:\n${display ? display.join('\n') : paths.join('\n')}`);
						resolve();
					});
			}
			catch(ex){

				this.log(ex);
			}
		});
	}
}

module.exports = new FileWatcher();