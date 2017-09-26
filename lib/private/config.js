"use strict";

try{

	const Config = require(`${process.cwd()}/Config.json`);
	Object.keys(Config).forEach((key) =>{

		process.env[key] = Config[key];
	});
    require('@studyportals/node-log').debug(`Env vars are overwritten by 'Config.json'`);
}
catch(e){

	// No 'Config.json' found, using default.
}

const log = require('@studyportals/node-log');

log.debug('PRTL env vars:');
Object.keys(process.env).forEach(function(key){

	if(key.startsWith("PRTL")){

		log.debug(`${key} => ${process.env[key]}`);
	}
});