"use strict";

const repo_status = require('./../../../private/github-repo-status');
const getRepoFromPackageJson = require('./lib/getRepoFromPackageJson');
const log = require('@studyportals/node-log');

/**
 * Obtains the repo of the current project and reports the failed / total to GitHub pull request
 * @param failed
 * @param total
 * @return {*}
 */
module.exports = (failed, total) => {

	const repo = getRepoFromPackageJson();

	log.info(`Reporting to GitHub:${repo}: ${failed}/${total}`);
	return repo_status(repo, failed, total);
};