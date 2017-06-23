"use strict";

const fs = require('fs');
const rimraf = require('rimraf');
const should = require('should');
const git = require('gulp-git');

const temp = '/tmp';
const repo = 'git@github.com:studyportals/product-deploy.git';

beforeEach(function(done){
	this.timeout(5000);
	git.clone(repo, {args: temp}, done);
});

it(`should have cloned project into ${temp} directory`, function(done){
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