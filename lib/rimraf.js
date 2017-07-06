"use strict";

/**
 * @module lib/rimraf
 */

const _rimraf = require('rimraf');
const log = require('./log');
const yesno = require('yesno');

/**
 * The UNIX command `rm -rf` for node.
 *
 * It will ask the use (console) to retry when the glob cannot be removed due to
 * an `EBUSY` error.
 *
 * @param {string} glob - The glob to delete
 * @return {Promise}
 *
 * @alias module:lib/rimraf
 * @see https://www.npmjs.com/package/rimraf
 */
const rimraf = (glob) =>{

	return new Promise((resolve, reject) =>{

		_rimraf(glob, function(err){
			if(err){

				if(err.code === 'EBUSY'){
					log.error(`The folder "${err.path}" cannot be removed because it is in use.`);
					log.info(`Please close all programs which might use it.`);

					yesno.ask('Do you want to try again? [Y/n]', true, function(ok){
						if(ok){
							rimraf(glob);
						}else{
							process.exit();
						}
					});
				}
				else{

					return reject(err);
				}
			}
			resolve();
		});
	});
};

module.exports = rimraf;