"use strict";

const chai = require('chai');
chai.use(require('chai-fs'));
const prepare = require('./../lib/prepare');
const expect = chai.expect;
const rimraf = require('rimraf');

const dst = './testcases/prepare';

before(function(){
	return prepare.emptyDir(`${dst}/create_some_subfolder`)
		.then(() => { return prepare.emptyDir(dst) });
});

it('The folder should exist and be empty', () =>{

	expect(dst).to.be.a.directory().and.empty;
});

after(function(done){
	return rimraf(dst, function(err){
		if(err) return done(err);
		done();
	});
});
