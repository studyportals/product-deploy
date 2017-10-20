"use strict";

const semver = require('semver');
const log = require('@studyportals/node-log');
const path = require('path');
const pjsonInstalled = require('./../../package.json');
const fs = require('fs');

log.debug(`Using ${pjsonInstalled.name}@${pjsonInstalled.version}`);

const pjsonProjectPath = path.resolve(process.cwd(), 'package.json');

if(!fs.existsSync(pjsonProjectPath)){ return; } // File not found

const pjsonProject = require(pjsonProjectPath);

if(pjsonInstalled.name === pjsonProject.name){
	// Same package, nothing to do
	return;
}

const dependencies = {};

Object.assign(dependencies, pjsonProject.dependencies, pjsonProject.devDependencies);

if(!dependencies[pjsonInstalled.name]){
	log.warning(`${pjsonInstalled.name} does not exist in your package.json`);
	log.warning(`Please run 'npm install ${pjsonInstalled.name} -D' to add it.`);
	return;
}

const requiredVersion = dependencies[pjsonInstalled.name];
const installedVersion = pjsonInstalled.version;

if(!semver.satisfies(installedVersion, requiredVersion)){

	const errMsg = `You are running an incompatible version of ${pjsonInstalled.name}`;

	log.error(errMsg);
	log.warning(`Installed: version ${installedVersion}`);
	log.warning(`Required: version ${requiredVersion}`);
	log.warning(``);
	log.error(`Please run 'npm install' to update your packages.`);

	process.exit(1);
}