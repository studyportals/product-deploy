"use strict";

/**
 * Please run `gulp` in this folder. After that change the `js\test.js` file
 * and see if the changes end op in `./../dst/js/test.js` for yourself.
 *
 * The watchers are initiated on the gulp.stop process. Therefore it does not
 * work nicely together with Mocha. That is the reason to have this manual test.
 */

const env = require('../../../lib/private/env');
const PD = require('../../../index');
const path = require('path');

const from = path.resolve(__dirname);
const to = path.resolve(__dirname, '..', 'dst');
const gulp = require('gulp');

process.env.PRTL_ENV = process.env.PRTL_ENV || env.DEV;

const Deploy = new PD.Deploy({
	from,
	to,
	gulp
});

gulp.task('default', function(){

	/*
	 * I know it's private and should not be accessible. For this specific test
	 * case I will allow it.
	 */
	return Deploy.assemble()
		.then(function(){
			return Deploy.startWatchers()
		});
});