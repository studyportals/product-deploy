"use strict";

const PD = require('../index');
const path = require('path');
const chai = require('chai')
	.use(require('chai-fs'));

const expect = chai.expect;
const rimraf = require('./../lib/private/rimraf');

const Deploy = new PD.Deploy({
	from: path.resolve(__dirname, '..', 'testcases', 'deploy', 'src'),
	to: path.resolve(__dirname, '..', 'testcases', 'deploy', 'dst'),
	gulp: require('gulp')
});

describe('Deploy', function(){

	it('Should ensure the deploy folder exists and is empty', function(){

		this.timeout(10000);
		this.slow(1000);

		return Deploy.prepare()
			.then(() =>{
				expect(Deploy.opts.to).to.be.a.directory().and.empty;
			});
	});

	it('Should install composer', function(){

		this.timeout(30000);
		this.slow(15000);

		let vendorFolder = `${Deploy.opts.from}/vendor`;

		return rimraf(vendorFolder)
			.then(() => {

				return Deploy.composer()
			})
			.then(() =>{
				expect(vendorFolder).to.be.a.directory().and.not.empty;
			});
	});

	it('Should assemble the project', function(){

		this.timeout(10000);
		this.slow(5000);

		return Deploy.assemble()
			.then(() =>{
				expect(Deploy.opts.to).to.be.a.directory().and.not.empty;
			});
	});

	it('Should write the revision file', function(){

		this.timeout(10000);
		this.slow(500);

		return Deploy.writeRevisionJson()
			.then(() =>{

				const jsonPath = path.join(Deploy.opts.to, 'revision.json');
				expect(jsonPath).to.be.a.file();

				const revisionJson = require(jsonPath);
				expect(revisionJson).to.have.property('revision')
			});
	});

	it('Should compile sass', function(){

		this.timeout(10000);
		this.slow(5000);

		return Deploy.sass()
			.then(() =>{
				expect(path.join(Deploy.opts.to, 'css/style.css')).to.be.a.file();
			});
	});

	it('Should compile js', function(){

		this.timeout(10000);
		this.slow(5000);

		return Deploy.js()
			.then(() =>{
				expect(path.join(Deploy.opts.to, 'js/code.js')).to.be.a.file();
			});
	});

	it('Should configure the project', function(){

		this.slow(1000);

		process.env.PRTL_ENV = require('../lib/private/env').DEV;

		return Deploy.configure()
			.then(() =>{
				expect(path.join(Deploy.opts.to, 'Production.conf')).to.be.a.file();
				expect(path.join(Deploy.opts.to, 'Development.conf')).to.be.a.file();
			});
	});
});