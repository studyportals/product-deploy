# @studyportals/product-deploy@1.1.2-0

<a href="https://www.npmjs.com/package/@studyportals/product-deploy" title="View this project on NPM" target="_blank"><img src="https://img.shields.io/npm/v/@studyportals/product-deploy.svg?style=flat" alt="NPM version" /></a>
<a href="https://www.npmjs.com/package/@studyportals/product-deploy" title="View this project on NPM" target="_blank"><img src="https://img.shields.io/npm/dm/@studyportals/product-deploy.svg?style=flat" alt="NPM downloads" /></a>
<a href="https://www.npmjs.com/package/@studyportals/product-deploy" title="View this project on NPM" target="_blank"><img src="https://img.shields.io/npm/l/@studyportals/product-deploy.svg?style=flat" alt="NPM license" /></a>
<a href="https://david-dm.org/studyportals/product-deploy" title="View this project on David" target="_blank"><img src="https://img.shields.io/david/studyportals/product-deploy.svg?style=flat" alt="Dependencies" /></a>
<a href="https://david-dm.org/studyportals/product-deploy" title="View this project on David" target="_blank"><img src="https://img.shields.io/david/dev/studyportals/product-deploy.svg?style=flat" alt="Development Dependencies" /></a>

Toolset to deploy StudyPortals products

<a name="module_lib/jsdoc-to-markdown"></a>

## lib/jsdoc-to-markdown
<a name="exp_module_lib/jsdoc-to-markdown--module.exports"></a>

### module.exports() ⏏
Generate README.md based on package.json and corresponding *.js files.

It uses these properties from the package.json to build the documentation:
- <a href="https://docs.npmjs.com/files/package.json#name" target="_blank">name</a>
- <a href="https://docs.npmjs.com/files/package.json#version" target="_blank">version</a>
- <a href="https://docs.npmjs.com/files/package.json#repository" target="_blank">repository</a>
- <a href="https://docs.npmjs.com/files/package.json#description" target="_blank">description</a>
- <a href="https://docs.npmjs.com/files/package.json#main" target="_blank">main</a>
- <a href="https://docs.npmjs.com/files/package.json#directorieslib" target="_blank">directories.lib</a>

Example:
```Shell
node ./bin/jsdoc-to-markdown
```

```JavaScript
const JsdocToMarkdown = require('./lib/jsdoc-to-markdown');
JsdocToMarkdown();
```

**Kind**: Exported function  

_README.md generated at: Thu Jun 22 2017 14:25:34 GMT+0800 (China Standard Time)_