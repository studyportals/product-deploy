"use strict";

/**
 * @module lib/prepare
 */

const rimraf = require('./rimraf');
const mkdirp = require('./mkdirp');

/**
 * Empties this directory.
 *
 * Essentially it removes and re-created the directory.
 *
 * @see {@link #module_lib/rimraf|lib/rimraf}
 * @see {@link #module_lib/mkdirp|lib/mkdirp}
 *
 * @param {string} dir - The directory
 * @return {Promise}
 *
 * @static
 */
const emptyDir = (dir) =>{

	return rimraf(dir)
		.then(() => { return mkdirp(dir) });
};


module.exports = {
	emptyDir
};