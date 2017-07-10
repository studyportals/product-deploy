"use strict";

const chai = require('chai');
chai.use(require('chai-fs'));
const expect = chai.expect;
const path = require('path');
const prepare = require('./../lib/prepare');
const rimraf = require('./../lib/rimraf');

const dst = `${path.resolve(__dirname)}/../testcases/prepare`;

it('Should ensure the folder exists and is empty.', () =>{

	return prepare.ensureEmptyDir(`${dst}/create_some_subfolder`)
		.then(() =>{
			return prepare.ensureEmptyDir(dst)
		})
		.then(() =>{
			expect(dst).to.be.a.directory().and.empty;
		});
});

after(() =>{
	return rimraf(dst);
});
