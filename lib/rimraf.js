"use strict";

const _rimraf = require('rimraf');
const log = require('./log');

/**
 * @module lib/rimraf
 * @see https://www.npmjs.com/package/rimraf
 * @param {string} dir - The directory
 * @return {Promise}
 */
const rimarf = (dir) =>{

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

module.exports = rimarf;