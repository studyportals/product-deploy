"use strict";

const path = require('path');
const fs = require('fs-extra');

/**
 * @param {Object} opts
 * @param {string} [opts.from]
 * @param {string} opts.to
 * @return {Promise}
 */
const writeRevisionJson = (opts) => {

	const defaults = {
		'from': process.cwd(),
		'to': null,
	};
	opts = Object.assign(defaults, opts);

	const product = path.basename(opts.from);

	const revision = require('child_process')
		.execSync('git rev-parse HEAD', {
			cwd: opts.from
		})
		.toString().trim();

	const revisionJson = {
		product,
		timestamp: (new Date()).toUTCString(),
		revision: revision,
		dependencies: {}
	};

	revisionJson.dependencies[product] = revision;

	const revisionPath = path.join(opts.to, 'revision.json');
	const revisionData = JSON.stringify(revisionJson, null, 4);

	return fs.writeFile(revisionPath, revisionData, 'utf8');
};

module.exports = writeRevisionJson;