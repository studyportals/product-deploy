"use strict";

const _mkdirp = require('mkdirp');
const log = require('./log');

/**
 * @module lib/mkdirp
 * @see https://www.npmjs.com/package/mkdirp
 * @param {string} dir - The directory
 * @return {Promise}
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