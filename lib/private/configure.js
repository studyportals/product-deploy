"use strict";

const gulp = require('gulp');
const fs = require("fs-extra");
const path = require("path");
const log = require('@studyportals/node-log');
const env = require('./env');

/**
 * @param {Object} [opts]
 * @param {String} opts.from Dir
 * @param {String} opts.to BuildDir
 * @param {String} [opts.env=Production]
 * @return {Promise}
 * @private
 */
const _copyConfig = (opts) =>{

	return new Promise((resolve) =>{

		const defaults = {
			'from': process.cwd(),
			'to': null,
			'env': env.PRD,
		};
		opts = Object.assign(defaults, opts);

		if(opts.env === env.PRD){

			/*
			 XXX: The configure step from `prtl-registry` expects the folder Live
			 instead of Production. For now it is best to make these steps
			 interchangeable.
			 */
			opts.env = 'Live';
		}

		let configGlobs = [
			path.join(opts.from, 'Deploy', 'Config', opts.env, '**')
		];

		gulp.src(configGlobs, {dot: true})
			.pipe(gulp.dest(opts.to))
			.on('end', function(){

				for(let i = 0; i < configGlobs.length; i++){

					log.debug(`Configure: copy ${configGlobs[i]} -> ${opts.to}`);
				}
				log.info(`Configure: Configuration copied for env ${opts.env}`);

				resolve();
			});
	});
};

/**
 * Copy the project configuration.
 *
 * @param {Object} opts
 * @param {string} [opts.product]
 * @param {string} [opts.from]
 * @param {string} opts.to
 * @param {string} [opts.env=Testing]
 * @return {Promise}
 */
const configure = (opts) =>{

	const defaults = {
		'product': path.basename(process.cwd()),
		'from': process.cwd(),
		'to': null,
		'env': env.TST,
	};
	opts = Object.assign(defaults, opts);

	return _copyConfig({
		from: opts.from,
		to: opts.to
	})
		.then(function(){

			if(opts.env === env.PRD){

				return Promise.resolve();
			}

			return _copyConfig({
				from: opts.from,
				to: opts.to,
				env: opts.env
			})
		})
};

module.exports = configure;