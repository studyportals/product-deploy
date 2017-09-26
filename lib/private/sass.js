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

const references = [];

/**
 * Get a list of scss base files and their dependencies.
 *
 * This can be used to regenerate all dependencies when a base file is changed.
 *
 * @returns {Promise}
 */
const getReferences = function(cached){

	if(typeof cached === 'undefined'){

		cached = true;
	}

	if(cached && Object.keys(references).length > 0){

		return Promise.resolve(references);
	}
	else{

		log.debug(`getReferences: Rebuilding scss @import references`);
	}

	const sources = [
		'**/*.scss',
		`!*.scss`,
		'!bower_components/**/*',
		'!node_modules/**/*'
	];

	const glob = require('globby');
	const path = require('path');
	const fs = require('fs');
	const node_sass = require('node-sass');

	// TODO: Make globby fly, check with @iliqportals
	return glob(sources)
		.then(files =>{

			files.forEach(file =>{

				file = path.resolve(file);

				node_sass.renderSync({
					sourceMap: file,
					file: file,
					importer: (url, prev) =>{

						prev = path.resolve(prev);
						if(prev !== file) return;
						if(!url.endsWith(".scss")){

							url += ".scss";
						}

						const checkUrl = (original, targetDir) =>{

							let ref = original;
							/*
							 * Check if it is a base file
							 * references to _File.scss or File.scss Can be resolved to a file that is called _File.scss
							 */
							if(path.basename(original)[0] !== "_"){

								ref = path.resolve(targetDir, path.dirname(original), "_" + path.basename(original));
							}

							// Try checking for a file that is _File
							if(fs.existsSync(ref)){

								return ref;
							}

							// Try checking for a file that is exactly named
							ref = path.resolve(targetDir, original);
							if(fs.existsSync(ref)){

								return ref;
							}

							return undefined;
						};

						let ref = checkUrl(url, process.cwd());

						if(!ref){

							ref = checkUrl(url, path.dirname(file));
						}

						if(!ref){

							log.debug(`[!]File ${file} has a missing import ${url}`);
						}
						else{

							ref = path.resolve(ref);
							if(!references[ref]){

								references[ref] = [];
							}
							references[ref][file] = 1;
						}
					}
				});
			});
			log.debug(`getReferences: Rebuilding scss @import references, done`);
			return references;
		});
};

module.exports = {
	compile,
	getReferences
};