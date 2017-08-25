"use strict";

const exec = require('child_process').exec;
const log = require('@studyportals/node-log');
const fs = require('fs');

/**
 * @param {string} command
 * @param {string} cwd
 * @return {Promise}
 */
const executeCommand = (command, cwd) => {

	return new Promise((resolve) => {

		log.debug(`${command} in ${cwd}`);
		exec(command, {cwd: cwd, maxBuffer: 200*1024}, function(err, stdout){
			if(err){
				throw err;
			}
			resolve(stdout.trim());
		});
	});
};

/**
 * @param {string} cwd
 * @param {string} repo
 * @return {Promise}
 */
const clone = (cwd, repo) => {

	return executeCommand(`git clone ${repo}`, cwd);
};

/**
 * @param {string} repo
 * @return {Promise}
 */
const getCurrentBranchOf = (repo) => {

	return executeCommand('git rev-parse --abbrev-ref HEAD', repo).then(branch => {

		if(branch == "HEAD"){

			log.debug("Not on a branch");
			return executeCommand('git rev-parse HEAD', repo);
		}

		return new Promise(resolve => {

			resolve(branch);
		})
	});
};

/**
 * @param {string} cwd
 * @param {string} args
 * @returns {promise}
 */
const checkout = (cwd, args) => {

	return executeCommand(`git checkout ${args}`, cwd);
};

/**
 * @param {String} dest
 * @returns {Promise}
 */
const updateSubmodules = (dest)=>{

	return new Promise((resolve) =>{

		if(!fs.existsSync(`${dest}/.gitmodules`)){

			resolve();
			return;
		}

		log.debug(`cd ${dest}; git submodule update --init --force`);
		return executeCommand(`git submodule update --init --force`, dest)
			.then(() => {resolve();});
	});
};

module.exports = {
	updateSubmodules,
	getCurrentBranchOf,
	clone,
	checkout
};