'use strict';

const Spec = require('mocha/lib/reporters/spec');
const inherits = require('mocha/lib/utils').inherits;
const getRepoFromPackageJson = require('./getRepoFromPackageJson');
const repo_status = require('./github-repo-status');

/**
 * Reporter that extends the Default mocha SPEC Reporter and reports to GitHub pull request
 * @type {MochaReporter}
 */
module.exports = MochaReporter;

/**
 * Attaches listeners on the mocha 'passed' and 'test' events that then get reported
 * to GitHub on the 'end' event.
 * @param runner
 * @constructor
 */
function MochaReporter(runner){

	console.log('reporter');

	Spec.call(this, runner);
	let failed = 0;
	let passed = 0;
	let pending = 0;

	runner.on('pass', test => {

		passed++;
	});

	runner.on('pending', test => {

		pending++;
	});

	runner.on('fail', test => {

		failed++;
	});


	runner.on('end', () =>{

		const repo = getRepoFromPackageJson();

		let total = passed + pending + failed;

		return repo_status(repo, failed, total)
			.catch(ex =>{

				throw ex;
			});
	});
}

inherits(MochaReporter, Spec);