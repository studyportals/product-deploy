/*global require, module, process, describe, after, it*/
"use strict";

const chai = require('chai');

const request = require('chai-http');

chai.use(request);
chai.use(chai.should);

/**
 * @type {SimplePageTester}
 */
class SimplePageTester {

	/**
	 * @param {String} repo - Name of the GitHub repository
	 * @param {String} url - The base url to test.
	 */
	constructor(repo, url){

		this.repo = repo;
		this.url = url;
	}

	/**
	 * Executes simple accessibility tests to the specified pages.
	 *
	 * If the pages cannot be reached, the test will be marked as failed.
	 *
	 * @param {String[]} pages - List of pages to test for statuscode 200
	 */
	run(pages){

		const server = chai.request(this.url);
		const repo = this.repo;

		describe(this.url, function(){

			this.slow(1500);
			this.retries(2);
			this.timeout(30000);

			pages.forEach(path =>{

				it(`${path} should return a 200`, done =>{

					server
						.get(path)
						.set('Cache-Control', 'no-cache')
						.end((err, res) =>{

							chai.expect(err).to.not.exist;
							res.should.have.status(200);
							done();
						});
				});
			});

			after(function(){

				let failed = 0;

				for(let test of this.test.parent.tests){

					if(test.state === 'failed'){

						failed++;
					}
				}

				const repo_status = require('./private/github-repo-status');
				return repo_status(repo, failed, pages.length)
					.catch(ex =>{
						throw ex;
					});
			});
		});
	}
}

module.exports = SimplePageTester;