"use strict";

if(!require('shelljs').which('php')){
	throw new Error("PHP is a composer requirement and therefore it is required.");
}

const fs = require('fs');
const path = require('path');
const log = require('@studyportals/node-log');

/**
 * Composer dependencies will be installed only if a composer.json exists.
 *
 * The installation will complete, without applying any changes, when no
 * `composer.json` file is found.
 *
 * @param {Object} [opts]
 * @param {string} [opts.cwd=process.cwd()] Directory in which to execute
 * @param {boolean} [opts.dev=true] Should we install the dev dependencies as well?
 * composer install.
 *
 * @static
 * @return {Promise}
 */
const install = (opts) =>{

	let defaults = {
		'cwd': process.cwd(),
		'dev': true
	};
	opts = Object.assign(defaults, opts);

	return new Promise((resolve, reject) => {

		const composerFile = path.resolve(opts.cwd, 'composer.json');
		if(!fs.existsSync(composerFile)){

			log.debug('No composer.json found, skipping composer.install');
			resolve();
			return;
		}

		let path_to_phar = path.resolve(__dirname, '..', '..', 'phar', 'composer.phar');
		let command = `php "${path_to_phar}" install --no-interaction --working-dir "${opts.cwd}" --ansi`;

		if(!opts.dev){

			command = command.concat(' --no-dev');
		}

		log.info('Composer: Installing PHP dependencies...');

		require('shelljs').exec(command, {
			silent: true
		}, function(code, output){

			if(code !== 0){
				return reject(output);
			}

			if(output){

				let output_lines = output.replace(/^\s+|\s+$/, '').split(/[\n\r]+/); // Trims the output and returns it split into an array of lines
				for(let i = 0; i < output_lines.length; i++){
					log.debug(output_lines[i])
				}
			}

			log.info('Composer: completed.');
			resolve();
		});
	});
};

module.exports = {
	install
};