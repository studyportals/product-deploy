/*global require, module, process*/

"use strict";

const https = require('https');
const log = require('@studyportals/node-log');

/**
 * Send the test status to CloudWatch.
 *
 * This will only happen on TST environment to support integration with our Pull Requests on Github.
 *
 * @param {string} repo - Repository name, for example `product-deploy` for git@github.com:studyportals/product-deploy.git
 * @param {int} failures - The amount of failed tests.
 * @param {int} total - The amount of total tests
 *
 * Env vars:
 * - CODEBUILD_RESOLVED_SOURCE_VERSION || process.env.PRTL_SOURCE_VERSION
 * - CODEBUILD_BUILD_ID
 * - AWS_DEFAULT_REGION
 * - SP_LOG_HOST
 * - SP_LOG_PATH
 *
 * @return {Promise}
 */
function github_repo_status(repo, failures, total){

	if(process.env.PRTL_ENV !== require('./env').TST){

		return Promise.resolve({
			status: 'skipped',
			data: `GitHub repo status is only enabled on env TST. Current env: ${process.env.PRTL_ENV}`
		});
	}

	const sha = process.env.CODEBUILD_RESOLVED_SOURCE_VERSION || process.env.PRTL_SOURCE_VERSION;
	const build_id = process.env.CODEBUILD_BUILD_ID;
	const region = process.env.AWS_DEFAULT_REGION;
	const host = process.env.SP_LOG_HOST;
	const path = process.env.SP_LOG_PATH;

	if(!sha){

		return Promise.reject(`GithubRepoStatus: Missing env var 'CODEBUILD_RESOLVED_SOURCE_VERSION || PRTL_SOURCE_VERSION'`);
	}

	if(!build_id){

		return Promise.reject(`GithubRepoStatus: Missing env var 'CODEBUILD_BUILD_ID'`);
	}

	let data = {
		repo: repo,
		sha: sha,
		context: 'Simple Page Tester'
	};

	if(failures === 0){

		data.state = 'success';
		data.description = 'All passed';
	}
	else{

		data.state = 'failure';
		data.description = `${failures}/${total} failed`;

		let splits = build_id.split(':');
		let group = splits[0];
		let stream = splits[1];

		data.target_url = `https://${region}.console.aws.amazon.com/cloudwatch/home?region=${region}#logEventViewer:group=/aws/codebuild/${group};stream=${stream}`;
	}

	return new Promise((resolve, reject) =>{

		let request = https.request({
			host: host,
			path: path,
			port: 443,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		}, function(data){

			log.info(`Status '${data.description}' sent to ${host}${path}`);
			resolve();
		});

		request.on('error', function(error){
			reject(error);
		});

		request.write(JSON.stringify(data));
		request.end();
	});
}

module.exports = github_repo_status;
