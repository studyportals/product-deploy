"use strict";

const chai = require('chai')
    .use(require('chai-fs'));
const path = require('path');

/**
 * @param {Deploy} Deploy
 */
module.exports = function(Deploy){

	Deploy = Deploy || require('./getDeploy');

	it('Should configure the project', function(){

		this.slow(1000);

		process.env.PRTL_ENV = require('../../lib/private/env').DEV;

		return Deploy.configure()
			.then(() =>{
				chai.expect(path.join(Deploy.opts.cwd, 'Base.conf')).to.be.a.file();
				chai.expect(path.join(Deploy.opts.cwd, 'Development.conf')).to.be.a.file();
			});
	});
};