"use strict";

const chai = require('chai');
const composer = require('./../lib/composer');
const rimraf = require('./../lib/rimraf');

const CWD = `./testcases/composer`;

const deleteVendorFolder = function(){
	return rimraf(`${CWD}/vendor`);
};

before(deleteVendorFolder);

it('It should install composer dependencies', () =>{

	return composer.install({
		cwd: CWD
	});
}).timeout(20000);

after(deleteVendorFolder);