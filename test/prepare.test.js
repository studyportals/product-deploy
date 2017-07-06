"use strict";

const chai = require('chai');
chai.use(require('chai-fs'));
const expect = chai.expect;
const path = require('path');
const prepare = require('./../lib/prepare');
const rimraf = require('rimraf');

const dst = `${path.resolve(__dirname)}/../testcases/prepare`;

it('The folder should exist and be empty', () =>{

	return prepare.emptyDir(`${dst}/create_some_subfolder`)
		.then(() =>{
			return prepare.emptyDir(dst)
		})
		.then(() =>{
			expect(dst).to.be.a.directory().and.empty;
		});
});

after(function(done){
	return rimraf(dst, function(err){
		if(err) return done(err);
		done();
	});
});
