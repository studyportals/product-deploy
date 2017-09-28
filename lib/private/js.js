"use strict";

const log = require('@studyportals/node-log');
const js = require('@studyportals/js');
const gulp = require('gulp');
const gulpif = require('gulp-if');

/**
 * Compiles ES6 js into uglified ES2015 js.
 *
 * @param {Object} [opts]
 * @param {String} [opts.base=process.cwd()]
 * @param {String|Array} [opts.from=*.js] Glob
 * @param {String} [opts.to=process.cwd()]
 * @param {String} [opts.uglify=true]
 * @static
 */
const compile = (opts) =>{

	return new Promise((resolve, reject) =>{

		const cwd = process.cwd();

		const defaults = {
			'base': cwd,
			'from': `${cwd}/**/*.js`,
			'to': cwd,
			'uglify': true
		};

		opts = Object.assign(defaults, opts);

		const conditionBabel = function(file){

			log.debug(`Babel: ${file.relative}`);
			return true;
		};

		const conditionUglify = function(file){

			if(!opts.uglify){

				return false;
			}

			if(file.relative.endsWith('-module.js')){

				log.debug(`Uglify: ${file.relative} - SKIPPED`);
				return false;
			}

			log.debug(`Uglify: ${file.relative}`);
			return true;
		};

		gulp.src(opts.from, {base: opts.base})
			.pipe(gulpif(conditionBabel, js.babel.compile())).on('error', reject)
			.pipe(gulpif(conditionUglify, js.uglify.compile())).on('error', reject)
			.pipe(gulp.dest(opts.to))
			.on('end', () =>{
				log.info("JavaScript compiled.");
				resolve();
			});
	});
};

module.exports = {
	compile
};