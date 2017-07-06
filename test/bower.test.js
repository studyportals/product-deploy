"use strict";

const chai = require('chai');
const bower = require('./../lib/bower');
const rimraf = require('./../lib/rimraf');

const CWD = `./testcases/bower/`;

const deleteBowerComponents = function(){
	return rimraf(`${CWD}/bower_components`);
};

before(deleteBowerComponents);

it('It should install bower dependencies', () =>{

	return bower.install({
		cwd: CWD
	});
}).timeout(10000);

after(deleteBowerComponents);