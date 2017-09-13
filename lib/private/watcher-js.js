"use strict";

const Watcher = require('./watcher');

class JSWatcher extends Watcher {

	/**
	 * Takes the file, puts it through babel es2015, if compress is enabled -
	 * uses uglify on it and puts it in the build directory.
	 *
	 * @param paths glob patterns to files/actual files
	 * @param display if has specific way to be logged as ( too many files -> display is just the pattern )
	 * @param base the location in which the files are
	 * @param origin root path of the glob from which the file originated
	 * @return {Promise}
	 */
	applyToPath(paths, display, base, origin){

		return require('./js').compile({
			base: base,
			from: paths,
			to: this.buildDir,
			uglify: this.compress
		});
	}
}

module.exports = new JSWatcher();