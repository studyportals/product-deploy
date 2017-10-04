'use strict';

const Spec = require('mocha/lib/reporters/spec');
const inherits = require('mocha/lib/utils').inherits;
const reportStatus = require('./lib/reportStatus');

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
function MochaReporter(runner) {

	Spec.call(this, runner);
	let failed = 0;
	let passed = 0;

	runner.on('pass', test => {

		passed += 1;
	});

	runner.on('fail', test => {

		failed += 1;
	});

	runner.on('end', () => {

		return reportStatus(failed, passed + failed).catch(ex => {

			throw ex;
		});
	});
}

inherits(MochaReporter, Spec);