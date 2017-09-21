"use strict";

const PD = require('../index');
const path = require('path');
const chai = require('chai');

const expect = chai.expect;
const gulp = require('gulp');

PD.attachToGulp(gulp, {
	buildDir: path.resolve(__dirname, '..', 'testcases', 'deploy', 'dst')
});

const testTask = function(task){

	it(`Gulp should have task ${task}`, function(){

		expect(gulp).to.have.property('tasks');
		expect(gulp.tasks).to.have.property(task);
	});
};

describe('attachToGulp', function(){

	testTask('deploy.cms.workingcopy');
	testTask('deploy.servicelayer');
	testTask('deploy.servicelayer.codebuild');
});