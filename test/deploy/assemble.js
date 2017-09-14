"use strict";

const chai = require('chai');

/**
 * @param {Deploy} Deploy
 */
module.exports = function(Deploy){

	Deploy = Deploy || require('./getDeploy');

	it('Should assemble the project', function(){

		this.timeout(10000);
		this.slow(5000);

		return Deploy.assemble()
			.then(() =>{
				chai.expect(Deploy.opts.to).to.be.a.directory().and.not.empty;
			});
	});
};