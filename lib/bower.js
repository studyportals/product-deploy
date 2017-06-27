"use strict";

/**
 * @module bower
 */

const fs = require('fs');
const bower = require('gulp-bower');
const path = require('path');
const log = require('./log');

/**
 * Install bower dependencies.
 *
 * @param {Object} [opts]
 * @param {string} [opts.cwd=process.cwd()] current working directory
 *
 * @return {Promise}
 */
const install = (opts) =>{

	let defaults = {
		'cwd': process.cwd()
	};

	opts = Object.assign(defaults, opts);

	return new Promise((resolve, reject) => {

		fs.stat(path.resolve(opts.cwd, 'bower.json'), (err) =>{

			if(err && err.errno == -4058){

				log.debug('No bower.json found, skipping bower.install');
				resolve();
			}
			else if(err){

				log.error(err);
				reject(err);
			}
			else{

				bower(opts)
					.on('error', reject)
					.on('end', resolve);
			}
		});
	});
};

module.exports = {
	install
};