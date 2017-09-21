"use strict";

const log = require('@studyportals/node-log');
const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const flexbugsfixes = require('postcss-flexbugs-fixes');
const gulpif = require('gulp-if');

/**
 * Output styles
 * @static
 * @enum {string}
 * @type {{
 * 	  NESTED: string,
 * 	  COMPRESSED: string
 * }}
 */
const OUTPUTSTYLE = {
	NESTED: 'nested',
	COMPRESSED: 'compressed'
};

/**
 * Compile scss into css.
 *
 * It will find all *.scss files in `opts.cwd` by default
 *
 * @param {Object} [opts]
 * @param {String} [opts.base=process.cwd()]
 * @param {String|Array} [opts.from=See comment above] Glob
 * @param {String|Array} [opts.to=process.cwd()] Glob
 * @param {String} [opts.compress=true]
 * @static
 */
const compile = (opts) =>{

	return new Promise((resolve, reject) =>{

		const cwd = process.cwd();

		const defaults = {
			'base': cwd,
			'from': `${cwd}/**/*.scss`,
			'to': cwd,
			'compress': true
		};

		opts = Object.assign(defaults, opts);

		const postProcessors = [
			flexbugsfixes(),
			autoprefixer({
				browsers: ["> 1%", "last 5 versions", "IE 8"]
			})
		];

		const outputStyle = (opts.compress) ?
			OUTPUTSTYLE.COMPRESSED : OUTPUTSTYLE.NESTED;

		log.debug(`Sass outputStyle: '${outputStyle}'`);

		const conditionSass = function(file){

			log.debug(`Sass: ${file.relative}`);
			return true;
		};

		gulp.src(opts.from, {base: opts.base})
			.pipe(gulpif(conditionSass, sass({
				includePaths: [opts.base],
				outputStyle
			}))).on('error', reject)
			.pipe(postcss(postProcessors)).on('error', reject)
			.pipe(gulp.dest(opts.to))
			.on('end', function(){
				log.info("Sass compiled.");
				resolve();
			});
	});
};

module.exports = {
	compile
};