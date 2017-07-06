"use strict";

const chai = require('chai');
const bower = require('./../lib/bower');
const rimraf = require('rimraf');

const CWD = `${path.resolve(__dirname)}/../testcases/bower/`;

const deleteBowerComponents = function(done){
	rimraf(`${CWD}/bower_components`, function(err){
		if(err) return done(err);
		done();
	});
};

before(deleteBowerComponents);

it('It should install bower dependencies', () =>{

	return bower.install({
		cwd: CWD
	});
}).timeout(10000);

after(deleteBowerComponents);