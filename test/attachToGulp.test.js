"use strict";

const PD = require('../index')
const path = require('path');
const chai = require('chai');

const expect = chai.expect;
const gulp = require('gulp');

PD.attachToGulp(gulp, {
	buildDir: path.resolve(__dirname, '..', 'testcases', 'deploy', 'dst')
});

describe('attachToGulp', function(){

	it('Gulp should have tasks defined', function(){

		expect(gulp).to.have.property('tasks');
	});

	it('Gulp should have task deploy.cms.workingcopy', function(){

		expect(gulp.tasks).to.have.property('deploy.cms.workingcopy');
	});

	it('Gulp should have task deploy.servicelayer', function(){

		expect(gulp.tasks).to.have.property('deploy.servicelayer');
	});

	it('Gulp should have task deploy.servicelayer.codebuild', function(){

		expect(gulp.tasks).to.have.property('deploy.servicelayer.codebuild');
	});
});