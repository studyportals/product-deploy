"use strict";

const fs = require('fs');
const rimraf = require('rimraf');
const should = require('should');
const git = require('gulp-git');

const temp = '/tmp';

beforeEach(function(done){
	this.timeout(5000);
	const repo = 'git://github.com/stevelacy/gulp-git';
	git.clone(repo, {args: temp}, done);
});

it('should have cloned project into tmp directory', function(done){
	fs.stat(`${temp}/.git`, function(err){
		should.not.exist(err);
		done();
	});
});

afterEach(function(done){
	rimraf(temp, function(err){
		if(err) return done(err);
		done();
	});
});