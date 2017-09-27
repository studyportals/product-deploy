"use strict";

const gulp = require('gulp');
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

		let src = path.join(opts.from, 'Deploy', 'Config', opts.env);

		const fs = require('fs');

		if(!fs.existsSync(src)){

			log.warning(`Configure: cannot find ${src}`);
			return resolve();
		}

		log.debug(`Configure: copy ${src} -> ${opts.to}`);
		gulp.src(path.join(src, '**'), {dot: true})
			.pipe(gulp.dest(opts.to))
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
		to: opts.to,
		env: 'Base'
	})
		.then(function(){

			return _copyConfig({
				from: opts.from,
				to: opts.to,
				env: opts.env
			});
		})
};

module.exports = configure;