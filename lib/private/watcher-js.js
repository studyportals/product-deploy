"use strict";

const Watcher = require('./watcher');

class JSWatcher extends Watcher {

	/**
	 * Takes the file, puts it through babel es2015, if compress is enabled -
	 * uses uglify on it and puts it in the build directory.
	 *
	 * @inheritDoc
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