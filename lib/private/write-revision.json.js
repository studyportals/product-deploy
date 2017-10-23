"use strict";

const path = require('path');
const fs = require('fs-extra');

const getProduct = (src) => {

	const pjson = path.resolve(src, "package.json");

	if(fs.existsSync(pjson)){

		return require(pjson).repository.url.split('/').slice(-1)[0].replace(".git", "");
	}

	return path.basename(src);

};

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

	const product = getProduct(opts.from);
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