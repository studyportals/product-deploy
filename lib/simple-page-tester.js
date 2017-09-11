/*global require, module, process*/
"use strict";

let chai = require('chai');

const request = require('chai-http');

chai.use(request);
chai.use(chai.should);

const logger = require('./github-repo-status');

module.exports = class SimplePageTester{

	constructor(repo, url){

		this.repo = repo;
		this.url = url;
	}

	run(pages){

		let server = chai.request(this.url);

		let send_log = true;
		const repo = this.repo;

		describe(this.url, function(){

			this.slow(1500);
			this.retries(2);
			this.timeout(30000);

			pages.forEach(path => {

				it(`${path} should return a 200`, done => {

					server
						.get(path)
						.set('Cache-Control', 'no-cache')
						.end((err, res) => {

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

				describe('After', () => {

					it('Log', done => {

						if(send_log && process.env.CODEBUILD_RESOLVED_SOURCE_VERSION){

							send_log = false;
							logger(repo, failed, pages.length, () => done());
							return;
						}

						done();
					})
				});
			});
		});
	}
};