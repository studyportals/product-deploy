"use strict";

/**
 * @module lib/mkdirp
 */

const _mkdirp = require('mkdirp');
const log = require('./log');

/**
 * @param {string} dir - The directory
 * @return {Promise}
 *
 * @alias module:lib/mkdirp
 * @see https://www.npmjs.com/package/mkdirp
 */
const mkdirp = (dir) =>{

	return new Promise((resolve, reject) =>{

		_mkdirp(dir, function(err){
			if(err) return reject(err);
			resolve();
		});
	});
};
module.exports = mkdirp;