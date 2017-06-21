"use strict";

const chai = require('chai');
const expect = chai.expect;

const path = require('path');
const fs = require('fs');

const globby = require('globby');

describe('Structurally', function(){

	const nonStrictFiles = [];
	const allFiles = globby.sync(["**/*.js", '!node_modules/**']);

	allFiles.forEach(file =>{

		if(fs.readFileSync(file).indexOf('use strict') === -1){

			nonStrictFiles.push(file);
		}
	});

	it('all js files should "use strict"', () =>{

		expect(nonStrictFiles).to.deep.equal([]);
	});
});