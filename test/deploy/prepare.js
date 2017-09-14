"use strict";

const chai = require('chai')
	.use(require('chai-fs'));

/**
 * @param {Deploy} Deploy
 */
module.exports = function(Deploy){

	Deploy = Deploy || require('./getDeploy');

	it('Should ensure the deploy folder exists and is empty', function(){

		this.timeout(10000);
		this.slow(1000);

		return Deploy.prepare()
			.then(() =>{
				chai.expect(Deploy.opts.to).to.be.a.directory().and.empty;
			});
	});
};