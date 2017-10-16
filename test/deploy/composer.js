"use strict";

const chai = require('chai');
const sp_rimraf = require('./../../lib/private/sp_rimraf');

/**
 * @param {Deploy} Deploy
 */
module.exports = function(Deploy){

	Deploy = Deploy || require('./getDeploy');

	it('Should install composer', function(){

		this.timeout(30000);
		this.slow(15000);

		let vendorFolder = `${Deploy.opts.cwd}/vendor`;

		return sp_rimraf(vendorFolder)
			.then(() =>{

				return Deploy.composer()
			})
			.then(() =>{
				chai.expect(vendorFolder).to.be.a.directory().and.not.empty;
			});
	});
};