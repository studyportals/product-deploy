"use strict";

/**
 * @module prepare
 */

const path = require('path');
const rimraf = require('./rimraf');
const mkdirp = require('./mkdirp');

/**
 * Empties this directory.
 *
 * Essentially it removed and re-created the directory.
 *
 * @param {string} dir - The directory
 *
 * @alias module:prepare
 * @return {Promise}
 */
const emptyDir = (dir) =>{

	return rimraf(dir)
		.then(() => { return mkdirp(dir) });
};


module.exports = {
	emptyDir
};