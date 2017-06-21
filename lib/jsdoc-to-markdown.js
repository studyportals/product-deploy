"use strict";

/**
 * A module to generate markdown documentation from JsDoc.
 * @module lib/jsdoc-to-markdown
 */

const fs = require("fs");
const jsdoc2md = require("jsdoc-to-markdown");
const path = require('path');

/**
 * Create the documentation based on the package.json and /lib/*.js files.
 *
 * Can be executed by calling `node ./bin/jsdoc-to-markdown`
 */
module.exports = () =>{

	const package_json = path.resolve('package.json');
	const filename = 'README.md';
	const base_folder = path.dirname(package_json);
	const pjson = require(`${package_json}`);
	const files = [],
		header = [],
		footer = [];

	header.push(`# ${pjson.name}@${pjson.version}`);
	header.push(``);

	header.push(`[![NPM version](https://img.shields.io/npm/v/${pjson.name}.svg?style=flat)](https://www.npmjs.com/package/${pjson.name} "View this project on NPM")`);
	header.push(`[![NPM downloads](https://img.shields.io/npm/dm/${pjson.name}.svg?style=flat)](https://www.npmjs.com/package/${pjson.name} "View this project on NPM")`);
	header.push(`[![NPM license](https://img.shields.io/npm/l/${pjson.name}.svg?style=flat)](https://www.npmjs.com/package/${pjson.name} "View this project on NPM")`);
	header.push(`[![David](https://img.shields.io/david/${pjson.name}.svg?style=flat)](https://david-dm.org/${pjson.name})`);
	header.push(`[![David](https://img.shields.io/david/dev/${pjson.name}.svg?style=flat)](https://david-dm.org/${pjson.name}#info=devDependencies)`);
	header.push(``);

	if(pjson['description']){
		header.push(`${pjson['description']}`);
		header.push(``);
	}

	footer.push(`_Package published at: ${new Date()}_`);

	files.push(`${base_folder}/${pjson.main}`);

	if(fs.existsSync(`${base_folder}/lib/`)){
		files.push(`${base_folder}/lib/*.js`);
	}

	const data = jsdoc2md.renderSync({files: files});
	fs.writeFileSync(`${filename}`, `${header.join('\n')}\n${data}\n${footer.join('\n')}`);
};

