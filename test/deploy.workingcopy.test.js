"use strict";

const PD = require('../index');
const path = require('path');
const chai = require('chai')
	.use(require('chai-fs'));

const expect = chai.expect;

const from = path.resolve(__dirname, '..', 'testcases', 'deploy-from');
const to = path.resolve(__dirname, '..', 'testcases', 'deploy-build');
const gulp = require('gulp');

const Deploy = new PD.Deploy({
	from,
	to,
	gulp
});

describe('Deploy', function(){

	it('Should deploy', function(){

		this.timeout(60000);

		return Deploy.workingCopy()
			.then(() =>{
				expect(to).to.be.a.directory().and.not.empty;
				expect(path.join(to, 'css/style.css')).to.be.a.file();
				expect(path.join(to, 'revision.json')).to.be.a.file();
			});
	});
});