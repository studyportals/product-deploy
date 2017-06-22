"use strict";

/**
 * @module lib/jsdoc-to-markdown
 */

const fs = require("fs");
const jsdoc2md = require("jsdoc-to-markdown");
const path = require('path');

/**
 * Generate README.md based on package.json and corresponding *.js files.
 *
 * It uses these properties from the package.json to build the documentation:
 * - <a href="https://docs.npmjs.com/files/package.json#name" target="_blank">name</a>
 * - <a href="https://docs.npmjs.com/files/package.json#version" target="_blank">version</a>
 * - <a href="https://docs.npmjs.com/files/package.json#repository" target="_blank">repository</a>
 * - <a href="https://docs.npmjs.com/files/package.json#description" target="_blank">description</a>
 * - <a href="https://docs.npmjs.com/files/package.json#main" target="_blank">main</a>
 * - <a href="https://docs.npmjs.com/files/package.json#directorieslib" target="_blank">directories.lib</a>
 *
 * Example:
 * ```Shell
 * node ./bin/jsdoc-to-markdown
 * ```
 *
 * ```JavaScript
 * const JsdocToMarkdown = require('./lib/jsdoc-to-markdown');
 * JsdocToMarkdown();
 * ```
 */
module.exports = () =>{

	const package_json = path.resolve('package.json');
	const filename = 'README.md';
	const pjson = require(`${package_json}`);
	const files = [],
		lines = [];

	// Title
	lines.push(`# ${pjson.name}@${pjson.version}`);
	lines.push(``);

	// Labels
	const usernameRepo = pjson.repository.url.split('/').slice(-2).join('/').replace('.git', '');
	const npmjsUrl = `https://www.npmjs.com/package/${pjson.name}`;
	lines.push(`<a href="${npmjsUrl}" title="View this project on NPM" target="_blank"><img src="https://img.shields.io/npm/v/${pjson.name}.svg?style=flat" alt="NPM version" /></a>`);
	lines.push(`<a href="${npmjsUrl}" title="View this project on NPM" target="_blank"><img src="https://img.shields.io/npm/dm/${pjson.name}.svg?style=flat" alt="NPM downloads" /></a>`);
	lines.push(`<a href="${npmjsUrl}" title="View this project on NPM" target="_blank"><img src="https://img.shields.io/npm/l/${pjson.name}.svg?style=flat" alt="NPM license" /></a>`);
	lines.push(`<a href="https://david-dm.org/${usernameRepo}" title="View this project on David" target="_blank"><img src="https://img.shields.io/david/${usernameRepo}.svg?style=flat" alt="Dependencies" /></a>`);
	lines.push(`<a href="https://david-dm.org/${usernameRepo}" title="View this project on David" target="_blank"><img src="https://img.shields.io/david/dev/${usernameRepo}.svg?style=flat" alt="Development Dependencies" /></a>`);
	lines.push(``);

	// Description
	if(pjson['description']){
		lines.push(`${pjson['description']}`);
		lines.push(``);
	}

	// JsDoc
	if(pjson['main']){
		files.push(pjson['main']);
	}

	if(pjson['directories'] && pjson['directories']['lib']){
		const libPath = pjson['directories']['lib'];
		if(fs.existsSync(libPath)){
			files.push(`${libPath}/*.js`);
		}
	}

	lines.push(jsdoc2md.renderSync({files: files}));

	// Footer
	lines.push(`_${filename} generated at: ${new Date()}_`);

	fs.writeFileSync(`${filename}`, lines.join('\n'));
};