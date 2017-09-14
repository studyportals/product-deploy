/*global require, module, process*/

"use strict";

const https = require('https');
const log = require('@studyportals/node-log');

/**
 *
 * @param repo
 * @param failures
 * @param total
 * @return {Promise}
 */
module.exports = function(repo, failures, total){

	const sha = process.env.CODEBUILD_RESOLVED_SOURCE_VERSION;
	const build_id = process.env.CODEBUILD_BUILD_ID;
	const region = process.env.AWS_DEFAULT_REGION;
	const host = process.env.SP_LOG_HOST;
	const path = process.env.SP_LOG_PATH;

	if(!sha){

		log.debug(`GithubRepoStatus: Missing env var 'CODEBUILD_RESOLVED_SOURCE_VERSION', stopping`);
		return Promise.resolve();
	}

	if(!build_id){

		log.debug(`GithubRepoStatus: Missing env var 'CODEBUILD_BUILD_ID', stopping`);
		return Promise.resolve();
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

		let [group, stream] = build_id.split`:`;

		data.target_url = `https://${region}.console.aws.amazon.com/cloudwatch/home?region=${region}#logEventViewer:group=/aws/codebuild/${group};stream=${stream}`;
	}

	return new Promise((resolve) => {

		let request = https.request({
			host: host,
			path: path,
			port: 443,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		}, function(){

			log.info(`Status '${data.description}' sent to ${host}/${path}`);
			resolve();
		});

		request.write(JSON.stringify(data));
		request.end();
	});
};