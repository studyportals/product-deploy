"use strict";

const chai = require('chai');
const path = require('path');

/**
 * @param {Deploy} Deploy
 */
module.exports = function(Deploy){

	Deploy = Deploy || require('./getDeploy');

	it('Should write the revision file', function(){

		this.timeout(10000);
		this.slow(500);

		return Deploy.writeRevisionJson()
			.then(() =>{

				const jsonPath = path.join(Deploy.opts.from, 'revision.json');
				chai.expect(jsonPath).to.be.a.file();

				const revisionJson = require(jsonPath);
				chai.expect(revisionJson).to.have.property('revision')
			});
	});
};