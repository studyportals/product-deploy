"use strict";

const log = require('@studyportals/node-log');
const js = require('@studyportals/js');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');

/**
 * Compiles ES6 js into uglified ES2015 js.
 *
 * @param {Object} [opts]
 * @param {String} [opts.base=process.cwd()]
 * @param {String|Array} [opts.from=*.js] Glob
 * @param {String} [opts.to=process.cwd()]
 * @param {String} [opts.uglify=true]
 * @param {String} [opts.sourcemaps=true] - Falls back to false when `opts.uglify` is false.
 * @param {boolean} [opts.progress=true]
 * @static
 */
const compile = (opts) =>{

	return new Promise((resolve, reject) =>{

		log.info("JavaScript compiling. This might take a while...");

		const cwd = process.cwd();

		const defaults = {
			'base': cwd,
			'from': `${cwd}/**/*.js`,
			'to': cwd,
			'uglify': true,
			'sourcemaps': true,
			'progress': true
		};

		opts = Object.assign(defaults, opts);

		const _conditionSourceMaps = function(){

			return !(opts.uglify || !opts.sourcemaps);
		};

		const conditionSourceMapsInit = _conditionSourceMaps;

		const conditionSourceMapsWrite = function(file){

			let enabled = _conditionSourceMaps();

			if(enabled){

				log.debug(`SourceMaps: ${file.relative}`);
			}
			return enabled
		};

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

		const total_files = require('globby').sync(opts.from).length;
		const bar = require('./progressbar')(total_files);

		gulp.src(opts.from, {base: opts.base})
			.on('data', function(){
				if(opts.progress && !log.debug()){
					bar.tick();
				}
			})
			.pipe(gulpif(conditionSourceMapsInit, sourcemaps.init())).on('error', reject)
			.pipe(gulpif(conditionBabel, js.babel.compile())).on('error', reject)
			.pipe(gulpif(conditionUglify, js.uglify.compile())).on('error', reject)
			.pipe(gulpif(conditionSourceMapsWrite, sourcemaps.write('.'))).on('error', reject)
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