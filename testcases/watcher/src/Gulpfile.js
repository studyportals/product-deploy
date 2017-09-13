"use strict";

/**
 * Please run `gulp` in this folder. After that change the `js\test.js` file
 * and see if the changes end op in `./../dst/js/test.js` for yourself.
 *
 * The watchers are initiated on the gulp.stop process. Therefore it does not
 * work nicely together with Mocha. That is the reason to have this manual test.
 */

process.env.PRTL_ENV = process.env.PRTL_ENV || 'Development';

const deploy = require('../../../lib/private/deploy');
const path = require('path');

const from = path.resolve(__dirname);
const to = path.resolve(__dirname, '..', 'dst');
const gulp = require('gulp');

const Deploy = new deploy({
	from,
	to,
	gulp
});

gulp.task('default', function(){

	/*
	 * I know it's private and should not be accessible. For this specific test
	 * case I will allow it.
	 */
	return Deploy._assemble()
		.then(function(){ return Deploy._js_watcher() });
});