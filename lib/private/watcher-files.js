"use strict";

const Watcher = require('./watcher');

class FileWatcher extends Watcher {

	/**
	 * Copies the file and moves it to the build directory.
	 *
	 * @inheritDoc
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