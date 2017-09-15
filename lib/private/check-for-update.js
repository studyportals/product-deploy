"use strict";

const semver = require('semver');
const log = require('@studyportals/node-log');
const path = require('path');
const pjsonInstalled = require('./../../package.json');
const pjsonProject = require(path.join(process.cwd(), 'package.json'));

log.debug(`Using ${pjsonInstalled.name}@${pjsonInstalled.version}`);

if(pjsonInstalled.name === pjsonProject.name){
	// Same package, nothing to do
	return;
}

const dependencies = {};

Object.assign(dependencies, pjsonProject.dependencies, pjsonProject.devDependencies);

if(!dependencies[pjsonInstalled.name]){
	// Dependency is not installed.
	return;
}

const requiredVersion = dependencies[pjsonInstalled.name];
const installedVersion = pjsonInstalled.version;

if(!semver.satisfies(installedVersion, requiredVersion)){

	log.error(`You are running an outdated version of ${pjsonInstalled.name}`);
	log.warning(`Installed: version ${installedVersion}`);
	log.warning(`Required: version ${requiredVersion}`);
	log.warning(``);
	log.error(`Please run 'npm install' to update your packages.`);
	process.exit(0);
}