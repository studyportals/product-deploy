"use strict";

/**
 * @module lib/ensureDir
 */

const mkdirp = require('mkdirp');

/**
 * @param {string} dir - The directory
 * @return {Promise}
 *
 * @static
 * @see https://www.npmjs.com/package/mkdirp
 */
const ensureDir = (dir) =>{

	return new Promise((resolve, reject) =>{

		mkdirp(dir, function(err){
			if(err) return reject(err);
			resolve();
		});
	});
};
module.exports = ensureDir;