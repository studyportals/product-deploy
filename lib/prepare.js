"use strict";

/**
 * @module lib/prepare
 */

const rimraf = require('./rimraf');
const mkdirp = require('./mkdirp');

/**
 * Empties this directory.
 *
 * Essentially it removed and re-created the directory.
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