"use strict";

const request = require('request');
const log = require('@studyportals/node-log');
const userInput = process.argv.slice(2).join(',');
const cwd = process.cwd();
const startTime = new Date();
const pjson = require('../../package.json');
const logState = (state, time, success, extra) =>{

	if(!extra){

		extra = "";
	}

	const date = (new Date()).toISOString().substring(0, 19).replace('T', ' ');

	try{
		request.post(process.env.PRTL_DEPLOYLOG_ENDPOINT, {
				json: {
					state: state,
					input: userInput,
					success: success,
					time: time,
					packages: '',
					platform: process.platform,
					arch: process.arch,
					extra: extra.replace(/'/g, 'QUOTE'),
					project: cwd.replace(/\\/g, "/").split('/').slice(-1),
					uid: process.env.USERNAME || process.env.USER,
					jenkins: cwd.indexOf('/StudyPortals') == 0,
					date: date,
					version: pjson.version
				}
			}
		);
	}
	catch(ex){

	}
};

module.exports.attachToGulp = (gulp) =>{

	if(!(typeof(gulp) === "object" && gulp.constructor && gulp.constructor.name == "Gulp")){

		throw new Error("Cannot register package validation to the specified " + gulp);
	}

	if(process.env.PRTL_DISABLE_GULP_LOG){

		log.debug("env variable PRTL_DISABLE_GULP_LOG is set, no build info will be supplied");
		return;
	}
	else if(!process.env.PRTL_DEPLOYLOG_ENDPOINT){

		log.debug("env variable PRTL_DEPLOYLOG_ENDPOINT is not set, no build info will be supplied");
		return;
	}
	else{

		log.debug("env variable PRTL_DISABLE_GULP_LOG is not set, build information will be sent for analysis");
		log.debug("build information is: installed packages, project name, errors, os type, os architecture, user input, date");
	}

	gulp.on('stop', () =>{

		logState('finish', (new Date() - startTime) / 1000.0, true);
	});

	gulp.on('err', (data) =>{

		if(data.message == "orchestration failed"){

			return;
		}
		logState('err', (new Date() - startTime) / 1000.0, false, data.message + " : " + data.err.stack);
	});

	process.on('uncaughtException', err =>{

		logState('err', (new Date() - startTime) / 1000.0, false, gulp.seq[0] + " : " + err.stack);
		log.error(err.stack);
	});
};