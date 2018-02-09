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
 * @throws Error
 * @return {Promise}
 */
const _configure = (opts) =>{

	return new Promise((resolve, reject) =>{

		let src = path.join(opts.cwd, 'Deploy', 'Config');

		if(process.env.PRODUCT){

			src = path.join(src, process.env.PRODUCT);
		}

		src = path.join(src, opts.env);

		const fs = require('fs');

		if(!fs.existsSync(src)){

			return reject(`Configure: cannot find ${src}`);
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
		env: 'Base'
	})
		.then(function(){

			return _configure(opts);
		})
};

module.exports = configure;
