"use strict";

const gulp = require('gulp');
const fs = require("fs-extra");
const path = require("path");
const log = require('@studyportals/node-log');
const env = require('./env');

/**
 * HashMap of product => producttype
 * @private
 */
const _products = {
	Masters: 'Academic',
	Bachelors: 'Academic',
	PhD: 'Academic',
	ShortCourses: 'Academic',
	UniversityAdmin: 'Academic',
	Scholarship: 'CMS',
	STeXX: 'CMS',
	DistanceLearning: 'Academic',
	Statistics: 'Academic',
	ServiceLayer: 'GenY',
	Publish: 'CMS',
	PreparationCourses: 'Academic',
	CDN: 'GenY'
};

/**
 * @param {Object} [opts]
 * @param {String} [opts.product=path.basename(process.cwd())]
 * @param {String} opts.to BuildDir
 * @param {String} [opts.env=Production]
 * @return {Promise}
 * @private
 */
const _copyConfig = (opts) =>{

	return new Promise((resolve) =>{

		const defaults = {
			'product': path.basename(process.cwd()),
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

		const cwd = process.cwd();
		const configRoot = path.resolve(cwd, "Deploy", "Config");
		const environmentConfigRoot = path.join(configRoot, opts.env, 'Deployments');
		const productType = _products[opts.product];

		let configGlobs = [];

		if(productType === 'CMS' || productType === 'Academic'){

			configGlobs.push(path.join(environmentConfigRoot, 'Base', productType, '**'));
		}

		configGlobs.push(path.join(environmentConfigRoot, opts.product, '**'));

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
 *
 * @param {Object} opts
 * @param {String} opts.to
 * @return {Promise}
 * @private
 */
const _deleteLocalConfig = (opts) => {

	const defaults = {
		'to': null,
	};
	opts = Object.assign(defaults, opts);

	const localConfig = path.resolve(opts.to, "Deploy", "Config");

	if(!fs.existsSync(localConfig)){

		return Promise.resolve;
	}

	return fs.remove(localConfig)
		.then(() => {
			log.info("Configure: Removed local Deploy/Config folder in build")
	});
};

/**
 * Copy the project configuration.
 *
 * @param {Object} opts
 * @param {string} [opts.product]
 * @param {string} opts.to
 * @param {string} opts.env
 * @return {Promise}
 */
const configure = (opts) => {

	const defaults = {
		'product': path.basename(process.cwd()),
		'to': null,
		'env': env.PRD,
	};
	opts = Object.assign(defaults, opts);

	return _copyConfig({to: opts.to})
		.then(function(){

			if(opts.env === env.PRD){

				return Promise.resolve();
			}

			return _copyConfig({
				to: opts.to,
				env: opts.env
			})
		})
		.then(function(){

			return _deleteLocalConfig({
				'to': opts.to
			})
		});
};

module.exports = configure;