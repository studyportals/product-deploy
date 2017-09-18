"use strict";

try{

	const Config = require(`${process.cwd()}/Config.json`);
	Object.keys(Config).forEach((key) =>{

		process.env[key] = Config[key];
	});
	console.log(`Using 'Config.json'`);
}
catch(e){

	console.log(`No 'Config.json' found, using default.`);
}

const log = require('@studyportals/node-log');

console.log('PRTL env vars:');
Object.keys(process.env).forEach(function(key){

	if(key.startsWith("PRTL")){

		console.log(`${key} => ${process.env[key]}`);
	}
});