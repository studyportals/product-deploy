"use strict";

const rimraf = require('rimraf');
const siteDB = require('../index').siteDB;
const path = require('path');

const buildDir = path.resolve(`./testcases/siteDB`);

before(function(){

	return new Promise((resolve, reject) =>{
		rimraf(`${buildDir}/Packages/Bachelors/Core/Site.db`, function(err){
			(err) ? reject(err) : resolve();
		});
	});
});

it('It should compile Site.db without errors', () =>{

	return siteDB.compile({
		buildDir,
		product: 'Bachelors'
	});
}).timeout(15000);