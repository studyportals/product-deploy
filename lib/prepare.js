"use strict";

/**
 * @module prepare
 */

const path = require('path');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const log = require('./log');

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

	return _rimraf(dir)
		.then(() => { return _mkdirp(dir) });
};

/**
 * @param {string} dir - The directory
 * @return {Promise}
 * @private
 */
const _rimraf = (dir) => {

	return new Promise((resolve, reject) => {

		rimraf(dir, function (err) {
			if(err) return reject(err);

			resolve();
		});
	});
};

/**
 * @param {string} dir - The directory
 * @return {Promise}
 * @private
 */
const _mkdirp = (dir) => {

	return new Promise((resolve, reject) => {

		mkdirp(dir, function (err) {
			if(err) return reject(err);

			resolve();
		});
	});
};

module.exports = {
	emptyDir
};