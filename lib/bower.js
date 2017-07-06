"use strict";

/**
 * @module lib/bower
 */

const fs = require('fs');
const bower = require('gulp-bower');
const path = require('path');
const log = require('./log');

/**
 * Bower dependencies will be installed only if a bower.json exists.
 *
 * The installation will complete, without applying any changes, when no
 * `bower.json` file is found.
 *
 * @param {Object} [opts]
 * @param {string} [opts.cwd=process.cwd()] Directory in which to execute bower
 * install.
 *
 * @static
 * @return {Promise}
 */
const install = (opts) =>{

	let defaults = {
		'cwd': process.cwd()
	};

	opts = Object.assign(defaults, opts);

	return new Promise((resolve, reject) => {

		const bowerFile = path.resolve(opts.cwd, 'bower.json');
		if(!fs.existsSync(bowerFile)){

			log.debug('No bower.json found, skipping bower.install');
			resolve();
			return;
		}

		bower(opts)
			.on('error', reject)
			.on('end', resolve);
	});
};

module.exports = {
	install
};