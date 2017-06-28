"use strict";

/**
 * @module composer
 */

const fs = require('fs');
const path = require('path');
const log = require('./log');
const composer = require('gulp-composer');

/**
 * Install composer dependencies.
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

		fs.stat(path.resolve(opts.cwd, 'composer.json'), (err) =>{

			if(err && err.errno == -4058){

				log.debug('No composer.json found, skipping composer.install');
				resolve();
			}
			else if(err){

				log.error(err);
				reject(err);
			}
			else{

				composer('install --no-interaction', {
					'bin': `php ./bin/composer.phar`,
					'working-dir': opts.cwd
				}).on('error', reject).on('end', resolve);
			}
		});
	});
};

module.exports = {
	install
};