"use strict";

const chai = require('chai')
    .use(require('chai-fs'));
const path = require('path');

/**
 * @param {Deploy} Deploy
 */
module.exports = function(Deploy){

	Deploy = Deploy || require('./getDeploy');

	it('Should compile sass', function(){

		this.timeout(10000);
		this.slow(5000);

		return Deploy.sass()
			.then(() =>{
				chai.expect(path.join(Deploy.opts.to, 'css/style.css')).to.be.a.file();
			});
	});
};