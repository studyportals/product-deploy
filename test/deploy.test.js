"use strict";

const PD = require('../index');
const path = require('path');
const chai = require('chai')
	.use(require('chai-fs'));

const expect = chai.expect;
const rimraf = require('./../lib/private/rimraf');

const from = path.resolve(__dirname, '..', 'testcases', 'deploy', 'src');
const to = path.resolve(__dirname, '..', 'testcases', 'deploy', 'dst');
const gulp = require('gulp');

const Deploy = new PD.Deploy({
	from,
	to,
	gulp
});

describe('Deploy', function(){

	// it('Should ensure the deploy folder exists and is empty', function(){
	//
	// 	this.timeout(10000);
	//
	// 	return Deploy.prepare()
	// 		.then(() =>{
	// 			expect(to).to.be.a.directory().and.empty;
	// 		});
	// });
	//
	// it('Should install composer', function(){
	//
	// 	this.timeout(30000);
	//
	// 	let vendorFolder = `${from}/vendor`;
	//
	// 	return rimraf(vendorFolder)
	// 		.then(() => {
	//
	// 			return Deploy.composer()
	// 		})
	// 		.then(() =>{
	// 			expect(vendorFolder).to.be.a.directory().and.not.empty;
	// 		});
	// });
	//
	// it('Should assemble the project', function(){
	//
	// 	this.timeout(10000);
	//
	// 	return Deploy.assemble()
	// 		.then(() =>{
	// 			expect(to).to.be.a.directory().and.not.empty;
	// 		});
	// });

	it('Should compile sass', function(){

		this.timeout(10000);
		this.slow(5000);

		return Deploy.sass()
			.then(() =>{
				expect(path.join(to, 'css/style.css')).to.be.a.file();
			});
	});

	// it('Should compile js', function(){
	//
	// 	this.timeout(10000);
	//
	// 	return Deploy.js()
	// 		.then(() =>{
	// 			expect(path.join(to, 'js/code.js')).to.be.a.file();
	// 		});
	// });
	//
	// it('Should configure the project', function(){
	//
	// 	process.env.PRTL_ENV = require('../lib/private/env').DEV;
	//
	// 	return Deploy.configure()
	// 		.then(() =>{
	// 			expect(path.join(to, 'Production.conf')).to.be.a.file();
	// 			expect(path.join(to, 'Development.conf')).to.be.a.file();
	// 		});
	// });
});