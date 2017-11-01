"use strict";

const chai = require('chai')
const expect = chai.expect;

const pjson = require('../package.json');

describe('bin', function(){

	it('the mocha command should exist', function(){

		expect(pjson).to.have.own.property('bin');
		expect(pjson.bin).to.have.own.property('mocha');
	});

});