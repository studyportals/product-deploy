"use strict";

/**
 * @module lib/prepare
 */

const rimraf = require('./rimraf');
const ensureDir = require('./ensureDir');

/**
 * Ensures the directory exists and is empty.
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
const ensureEmptyDir = (dir) =>{

	return rimraf(dir)
		.then(() =>{
			return ensureDir(dir)
		});
};

module.exports = {
	ensureEmptyDir
};