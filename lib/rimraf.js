"use strict";

/**
 * @module lib/rimraf
 */

const _rimraf = require('rimraf');
const log = require('./log');
const yesno = require('yesno');
const confirm = require('node-ask').confirm;

/**
 * The UNIX command `rm -rf` for node.
 *
 * @param {string} glob - The glob to delete
 * @return {Promise}
 *
 * @private
 * @see https://www.npmjs.com/package/rimraf
 */
const rimrafP = (glob) =>{
	return new Promise((resolve, reject) =>{
		_rimraf(glob, function(err){
			(err) ? reject(err) : resolve();
		});
	});
};

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
const rimraf = (glob) => {

	return rimrafP(glob)
		.catch(function(err){
			if(err.code === 'EBUSY'){

				log.error(`The folder "${err.path}" cannot be removed because it is in use.`);
				log.info(`Please close all programs which might use it.`);

				return confirm('Do you want to try again? [Y/n]: ')
					.then(function(ok){
						if(!ok){

							throw err;
						}

						return rimraf(glob);
					});
			}
			else{
				throw err;
			}
		})
};

module.exports = rimraf;