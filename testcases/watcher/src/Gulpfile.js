"use strict";

/**
 * Please run `gulp` in this folder. After that change the `js\test.js` file
 * and see if the changes end op in `./../dst/js/test.js` for yourself.
 *
 * The watchers are initiated on the gulp.stop process. Therefore it does not
 * work nicely together with Mocha. That is the reason to have this manual test.
 */

const path = require('path');

const from = path.resolve(__dirname);
const to = path.resolve(__dirname, '..', 'dst');
const gulp = require('gulp');

const Deploy = new require('../../../lib/private/deploy')({
	from,
	to,
	gulp
});

gulp.task('default', function(){

	return Deploy.startWatchers();
});