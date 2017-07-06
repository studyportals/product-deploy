"use strict";

const chai = require('chai');
const composer = require('./../lib/composer');
const rimraf = require('rimraf');

const CWD = `${path.resolve(__dirname)}/../testcases/composer`;

const deleteVendorFolder = function(done){
	rimraf(`${CWD}/vendor`, function(err){
		if(err) return done(err);
		done();
	});
};

before(deleteVendorFolder);

it('It should install composer dependencies', () =>{

	return composer.install({
		cwd: CWD
	});
}).timeout(20000);

after(deleteVendorFolder);