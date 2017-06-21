"use strict";

const chai = require('chai');
const chaiFiles = require('chai-files');

chai.use(chaiFiles);

const expect = chai.expect;
const file = chaiFiles.file;

it('README.md should exist and contain the current date/time.', () =>{

	const date = `${new Date()}`;
	require('./jsdoc-to-markdown')();
	expect(file('./README.md')).to.exist;
	expect(file('./README.md')).to.contain(date);
});
