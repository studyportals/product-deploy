"use strict";

const chai = require('chai');
const path = require('path');

/**
 * @param {Deploy} Deploy
 */
module.exports = function(Deploy){

	Deploy = Deploy || require('./getDeploy');

	it('Should compile js', function(){

		this.timeout(10000);
		this.slow(5000);

		return Deploy.js()
			.then(() =>{
				chai.expect(path.join(Deploy.opts.to, 'js/code.js')).to.be.a.file();
			});
	});
};