"use strict";

/**
 * @module rimraf
 */

const path = require('path');
const _mkdirp = require('mkdirp');
const log = require('./log');

/**
 * @param {string} dir - The directory
 * @return {Promise}
 * @private
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