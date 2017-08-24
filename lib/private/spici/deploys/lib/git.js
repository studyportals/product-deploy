"use strict";

const exec = require('child_process').exec;

const executeCommand = (command, cwd, isNotCriticalExecution) => {

	return new Promise((resolve, reject) => {

		console.log(`in ${cwd} ${command}`);
		exec(command, {cwd: cwd, maxBuffer: 200*1024}, function(err, stdout, stderr){
			if (err){
				if(isNotCriticalExecution)
				{
					reject(err);
					return;
				}
				throw err;
			}
			resolve(stdout.trim());
		});
	});
};

const getTagOrBranch = (cwd) => {

	return executeCommand('git symbolic-ref -q --short HEAD || git describe --tags --exact-match', cwd);
};

const fetch = (cwd) => {

	return executeCommand('git fetch', cwd);
};

const getIsOnBranch = (cwd) => {

	return executeCommand('git status', cwd).then(status => {

		return status.indexOf("HEAD detached at") == -1
	});
};

const clone = (cwd, repo) => {

	return executeCommand(`git clone ${repo}`, cwd);
};

const getCurrentBranchOf = (repo) => {

	return executeCommand('git rev-parse --abbrev-ref HEAD', repo).then(branch => {

		if(branch == "HEAD"){

			console.log("Not on a branch");
			return executeCommand('git rev-parse HEAD', repo);
		}

		return new Promise(resolve => {

			resolve(branch);
		})
	});
};

const checkout = (cwd, args) => {

	return executeCommand(`git checkout ${args}`, cwd);
};

const hasBranch = (cwd, branch) => {

	return executeCommand(`git rev-parse --verify ${branch}`, cwd, true)
		.then(() => true)
		.catch(ex => ex.toString().indexOf('Needed a single revision') == -1)
};

module.exports = {

	hasBranch,
	getCurrentBranchOf,
	clone,
	checkout,
	getTagOrBranch,
	fetch,
	getIsOnBranch
};