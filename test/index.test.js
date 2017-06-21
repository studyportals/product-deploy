"use strict";

const chai = require('chai');
const chaiFiles = require('chai-files');

const expect = chai.expect;
const file = chaiFiles.file;

it('index.js should exist.', () =>{

	expect(file('./index.js')).to.exist;
});