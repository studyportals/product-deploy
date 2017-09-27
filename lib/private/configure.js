"use strict";

const gulp = require('gulp');
const path = require("path");
const log = require('@studyportals/node-log');
const env = require('./env');

/**
 * Copy the project configuration.
 *
 * @param {Object} opts
 * @param {string} [opts.cwd=process.cwd()]
 * @param {string} [opts.env=Development]
 * @return {Promise}
 */
const configure = (opts) =>{

	return new Promise((resolve) =>{

		const defaults = {
			'cwd': process.cwd(),
			'env': env.DEV,
		};
		opts = Object.assign(defaults, opts);

		let src = path.join(opts.cwd, 'Deploy', 'Config', opts.env);

		const fs = require('fs');

		if(!fs.existsSync(src)){

			log.warning(`Configure: cannot find ${src}`);
			return resolve();
		}

		log.debug(`Configure: copy ${src} -> ${opts.cwd}`);
		gulp.src(path.join(src, '**'), {dot: true})
			.pipe(gulp.dest(opts.cwd))
			.on('error', function(err){
				throw err;
			})
			.on('end', function(){

				log.info(`Configure: Configuration copied for env ${opts.env}`);
				resolve();
			});
	});
};

module.exports = configure;