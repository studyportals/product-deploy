"use strict";

/**
 * @module rimraf
 */

const path = require('path');
const _rimraf = require('rimraf');
const log = require('./log');

/**
 * Promise version of rimraf
 * @param {string} dir - The directory
 * @return {Promise}
 * @private
 */
const rimraf = (dir) =>{

	return new Promise((resolve, reject) =>{

		_rimraf(dir, function(err){
			if(err){

				if(err.code === 'EBUSY'){
					log.error(`The folder "${err.path}" cannot be removed, did you leave a console window open?`)
				}

				return reject(err);
			}
			resolve();
		});
	});
};

module.exports = rimraf;