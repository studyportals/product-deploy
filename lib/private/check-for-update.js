"use strict";

const semver = require('semver');
const log = require('@studyportals/node-log');
const path = require('path');
const pjsonInstalled = require('./../../package.json');
const pjsonProject = require(path.join(process.cwd(), 'package.json'));

if(pjsonInstalled.name === pjsonProject.name){
	// Same package, nothing to do
	return;
}

if(!pjsonProject.devDependencies){
	return;
}

if(!pjsonProject.devDependencies[pjsonInstalled.name]){
	return;
}

const requiredVersion = pjsonProject.devDependencies[pjsonInstalled.name];
const installedVersion = pjsonInstalled.version;

if(!semver.satisfies(installedVersion, requiredVersion)){

	log.warning(`You are running an outdated version of ${pjsonInstalled.name}`);
	log.info(`Installed: version ${installedVersion}`);
	log.info(`Required: version ${requiredVersion}`);
	log.warning(``);
	log.warning(`Please run the following command to update your packages:`);
	log.warning(`npm install`);
	process.exit(0);
}