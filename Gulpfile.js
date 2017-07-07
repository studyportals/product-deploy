"use strict";

const gulp = require('gulp');
const prepare = require('./lib/prepare');

const path = require('path');

let dir = `${path.resolve(__dirname)}/testcases/prepare`;

gulp.task('test', function(){

	return prepare.emptyDir(dir);
});