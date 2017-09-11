/*global require, module, process*/

"use strict";

const https = require('https');

module.exports = function(repo, failures, total, done){

	let data = {
		repo: repo,
		sha: process.env.CODEBUILD_RESOLVED_SOURCE_VERSION,
		context: 'Simple Page Tester'
	};

	if(failures === 0){

		data.state = 'success';
		data.description = 'All passed';
	}
	else{

		data.state = 'failure';
		data.description = `${failures}/${total} failed`;

		let CODEBUILD_BUILD_ID = process.env.CODEBUILD_BUILD_ID;
		let [group, stream] = CODEBUILD_BUILD_ID.split`:`;
		let region = process.env.AWS_DEFAULT_REGION;

		data.target_url = `https://${region}.console.aws.amazon.com/cloudwatch/home?region=${region}#logEventViewer:group=/aws/codebuild/${group};stream=${stream}`;
	}

	let request = https.request({
		host: process.env.SP_LOG_HOST,
		path: process.env.SP_LOG_PATH,
		port: 443,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	}, done);

	request.write(JSON.stringify(data));
	request.end();
};