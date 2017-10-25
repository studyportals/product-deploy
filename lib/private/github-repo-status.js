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

	if(!process.env.SP_LOG_HOST || !process.env.SP_LOG_PATH){

		return Promise.resolve({
			status: 'skipped',
			data: `GitHubRepoStatus: Missing env var 'SP_LOG_HOST' or 'SP_LOG_PATH'`
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

	let request_body = {
		repo: repo,
		sha: sha,
		context: 'Simple Page Tester'
	};

	if(failures === 0){

		request_body.state = 'success';
		request_body.description = 'All passed';
	}
	else{

		request_body.state = 'failure';
		request_body.description = `${failures}/${total} failed`;

		let splits = build_id.split(':');
		let group = splits[0];
		let stream = splits[1];

		request_body.target_url = `https://${region}.console.aws.amazon.com/cloudwatch/home?region=${region}#logEventViewer:group=/aws/codebuild/${group};stream=${stream}`;
	}

	log.info(`Reporting to GitHub: ${request_body.repo}: ${request_body.description}`);

	return new Promise((resolve, reject) =>{

		let request = https.request({
			host: host,
			path: path,
			port: 443,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		}, function(){

			log.info(`Status '${request_body.description}' sent to ${host}${path}`);
			resolve();
		});

		request.on('error', function(error){
			reject(error);
		});

		request.write(JSON.stringify(request_body));
		request.end();
	});
}

module.exports = github_repo_status;
