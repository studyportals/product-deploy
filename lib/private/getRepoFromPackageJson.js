"use strict";

const path = require('path');
const log = require('@studyportals/node-log');

/**
 * Gets the repo of the current project, executing the tests.
 * @return {string | null}
 */
module.exports = () => {
	try{
		const packageJsonPath = path.resolve(process.cwd(), "package.json");
		const packageJson = require(packageJsonPath);

		let repository = packageJson.repository;
		repository = repository.url;
		repository = repository.split("/");
		repository = repository.slice(-1);
		repository = repository[0];
		repository = repository.replace(".git", "");
		return repository;
	}
	catch(ex){

		log.error("Could not determine repo in " + process.cwd());
		log.error(ex);
		return null;
	}
};