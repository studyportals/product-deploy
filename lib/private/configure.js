"use strict";

const gulp = require('gulp');
const path = require("path");
const log = require('@studyportals/node-log');

/**
 * Copy the project configuration.
 *
 * @param {Object} opts
 * @param {string} opts.cwd
 * @param {string} opts.env
 * @return {Promise}
 */
const _configure = (opts) =>{

	return new Promise((resolve) =>{

		let src = path.join(opts.cwd, 'Deploy', opts.flav, 'Config', opts.env);

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

				log.info(`Configure: Configuration copied for env ${opts.env} and flav ${opts.flav}`);
				resolve();
			});
	});
};

/**
 * Copy the project configuration.
 *
 * @param {Object} opts
 * @param {string} [opts.cwd=process.cwd()]
 * @param {string} [opts.env=Development]
 * @return {Promise}
 */
const configure = (opts) =>{

	const defaults = {
		'cwd': process.cwd(),
		'env': 'Base',
	};
	opts = Object.assign(defaults, opts);

	return _configure({
		cwd: opts.cwd,
		flav: opts.flav,
		env: 'Base'
	})
		.then(function(){

			return _configure({
				cwd: opts.cwd,
				flav: 'Shared',
				env: opts.env
			})
		})
		.then(function(){

			return _configure(opts);
		})
};

module.exports = configure;
