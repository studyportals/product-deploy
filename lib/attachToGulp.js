"use strict";

/**
 * Overwrite gulp tasks from `@prtl/local-deploy-portal-spici`
 *
 * This file is used to overwrite already existing gulp tasks from our private
 * `@prtl/local-deploy-portal-spici`. Therefore is is also an intermediate state
 * until we can fully rely on this package for our deploys. Once all the steps
 * are rewritten we can simply expose one method per type of deploy and call that
 * from the main `Gulpfile.js`
 *
 * @param {Gulp} gulp
 * @param {Object} opts
 * @param {string} opts.buildDir
 * @param {String} [opts.env=Testing]
 * @param {boolean} [opts.enableCompression=false]
 */
const attachToGulp = (gulp, opts) =>{

	const PD = require('./../index');
	const env = require('./env');
	const log = require('@studyportals/node-log');

	const defaults = {
		'env': env.TST,
		'enableCompression': false,
	};
	opts = Object.assign(defaults, opts);

	if(opts.env === 'Live'){

		log.warning(`env 'Live' is used while 'Production' is expected, rewritten to 'Production'`);
		opts.env = env.PRD;
	}

	gulp.task('spici.prepare', () => PD.prepare.ensureEmptyDir(opts.buildDir));
	gulp.task('spici.composer', () => PD.composer.install());
	gulp.task('spici.sass', () => PD.sass.compile({
		'from': [
			`${opts.buildDir}/**/*.scss`,
			`!${opts.buildDir}/bower_components/**/*`,
			`!${opts.buildDir}/node_modules/**/*`,
		],
		to: opts.buildDir,
		outputStyle: opts.enableCompression ? PD.sass.OUTPUTSTYLE.COMPRESSED : PD.sass.OUTPUTSTYLE.NESTED,
	}));
	gulp.task('spici.uglify', () => PD.js.compile({
		from: [
			`${opts.buildDir}/**/*.js`,
			`!${opts.buildDir}/bower_components/**/*`,
			`!${opts.buildDir}/node_modules/**/*`,
		],
		to: opts.buildDir,
		uglify: opts.enableCompression
	}));
	gulp.task('spici.configure', function(){
		return PD.configure({
			to: opts.buildDir,
			env: opts.env
		});
	});
	gulp.task('spici.assemble', function(){
		return PD.assemble({
			to: opts.buildDir,
		});
	});
	gulp.task('spici.bower', done => { done() });
	gulp.task('spici.siteDB', done => { done() });
	gulp.task('spici.replace', done => { done() });
};

module.exports = attachToGulp;