"use strict";

const chai = require('chai');
const expect = chai.expect;
const fs = require('fs');
const globby = require('globby');

describe('Structurally', function(){

	it('all js files should "use strict"', () =>{

		const nonStrictFiles = [];
		const allFiles = globby.sync([
			"index.js",
			"lib/**/*.js"]);

		allFiles.forEach(file =>{
			if(fs.readFileSync(file).indexOf('use strict') === -1){
				nonStrictFiles.push(file);
			}
		});

		expect(nonStrictFiles).to.deep.equal([]);
	});
});