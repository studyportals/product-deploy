"use strict";

const path = require('path');
const fs = require('fs-extra');

/**
 * @param {string} src - Used to resolve the revision with git.
 * @private
 * @return {string}
 */
const getRevision = (src) =>{

	if(process.env.CODEBUILD_RESOLVED_SOURCE_VERSION){

		return process.env.CODEBUILD_RESOLVED_SOURCE_VERSION
			.toString().trim();
	}

	return require('child_process')
		.execSync('git rev-parse HEAD', {
			cwd: src
		})
		.toString().trim();
};

/**
 * @param {Object} opts
 * @param {string} [opts.from]
 * @param {string} opts.to
 * @return {Promise}
 */
const writeRevisionJson = (opts) =>{

	const defaults = {
		'from': process.cwd(),
		'to': null,
	};
	opts = Object.assign(defaults, opts);

	const product = path.basename(opts.from);
	const revision = getRevision(opts.from);

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