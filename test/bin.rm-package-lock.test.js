"use strict";

const chai = require('chai')
	.use(require('chai-fs'));
const expect = chai.expect;
const path = require('path');

const pjson = require('../package.json');

describe('bin', function(){

	it('the preinstall command should exist', function(){

		expect(pjson).to.have.own.property('bin');
		expect(pjson.bin).to.have.own.property('rm-package-lock');
	});

	it('should remove package-lock.json file', function(){

		require(path.join(process.cwd(), pjson.bin['rm-package-lock']));
		expect(path.join(process.cwd(), 'package-lock.json')).to.not.be.a.path();
	});

	after(function() {
		require('child_process').execSync('git checkout HEAD -- package-lock.json')
	});
});