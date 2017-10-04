"use strict";

const path = require('path');

/**
 * Gets the repo of the current project, executing the tests.
 * @return {string}
 * @throws Error when no package.json / no valid repository.url
 */
module.exports = () => {

	const packageJsonPath = path.resolve(process.cwd(), "package.json");
	const packageJson = require(packageJsonPath);

	let repository = packageJson.repository;
	repository = repository.url;
	repository = repository.split("/");
	repository = repository.slice(-1);
	repository = repository[0];
	repository = repository.replace(".git", "");
	return repository;
};