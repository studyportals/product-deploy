# @studyportals/product-deploy@v1.5.0

<a href="https://www.npmjs.com/package/@studyportals/product-deploy" title="View this project on NPM" target="_blank"><img src="https://img.shields.io/npm/v/@studyportals/product-deploy.svg?style=flat" alt="NPM version" /></a>
<a href="https://www.npmjs.com/package/@studyportals/product-deploy" title="View this project on NPM" target="_blank"><img src="https://img.shields.io/npm/l/@studyportals/product-deploy.svg?style=flat" alt="NPM license" /></a>
<a href="https://www.npmjs.com/package/@studyportals/product-deploy" title="View this project on NPM" target="_blank"><img src="https://img.shields.io/npm/dm/@studyportals/product-deploy.svg?style=flat" alt="NPM downloads" /></a>
<a href="https://david-dm.org/studyportals/product-deploy" title="View this project on David" target="_blank"><img src="https://img.shields.io/david/studyportals/product-deploy.svg?style=flat" alt="Dependencies" /></a>
<a href="https://david-dm.org/studyportals/product-deploy" title="View this project on David" target="_blank"><img src="https://img.shields.io/david/dev/studyportals/product-deploy.svg?style=flat" alt="Development Dependencies" /></a>

Toolset to deploy StudyPortals products

## Modules

<dl>
<dt><a href="#module_@studyportals/product-deploy">@studyportals/product-deploy</a></dt>
<dd></dd>
<dt><a href="#module_lib/ensureDir">lib/ensureDir</a></dt>
<dd></dd>
<dt><a href="#module_lib/js">lib/js</a></dt>
<dd></dd>
<dt><del><a href="#module_lib/log">lib/log</a></del></dt>
<dd><p>Use <code>@studyportals/node-log</code> instead.</p>
</dd>
<dt><a href="#module_lib/prepare">lib/prepare</a></dt>
<dd></dd>
<dt><a href="#module_lib/rimraf">lib/rimraf</a></dt>
<dd></dd>
</dl>

<a name="module_@studyportals/product-deploy"></a>

## @studyportals/product-deploy

* [@studyportals/product-deploy](#module_@studyportals/product-deploy)
    * [.log](#module_@studyportals/product-deploy.log)
    * [.prepare](#module_@studyportals/product-deploy.prepare)
    * [.bower](#module_@studyportals/product-deploy.bower)
    * [.composer](#module_@studyportals/product-deploy.composer)
    * [.sass](#module_@studyportals/product-deploy.sass)
    * [.js](#module_@studyportals/product-deploy.js)

<a name="module_@studyportals/product-deploy.log"></a>

### @studyportals/product-deploy.log
**Kind**: static constant of [<code>@studyportals/product-deploy</code>](#module_@studyportals/product-deploy)  
**See**: [@studyportals/node-log](https://www.npmjs.com/package/@studyportals/node-log)  
<a name="module_@studyportals/product-deploy.prepare"></a>

### @studyportals/product-deploy.prepare
**Kind**: static constant of [<code>@studyportals/product-deploy</code>](#module_@studyportals/product-deploy)  
**See**: [lib/prepare](#module_lib/prepare)  
<a name="module_@studyportals/product-deploy.bower"></a>

### @studyportals/product-deploy.bower
**Kind**: static constant of [<code>@studyportals/product-deploy</code>](#module_@studyportals/product-deploy)  
**See**: [@studyportals/bower](https://www.npmjs.com/package/@studyportals/bower)  
<a name="module_@studyportals/product-deploy.composer"></a>

### @studyportals/product-deploy.composer
**Kind**: static constant of [<code>@studyportals/product-deploy</code>](#module_@studyportals/product-deploy)  
**See**: [@studyportals/composer](https://www.npmjs.com/package/@studyportals/composer)  
<a name="module_@studyportals/product-deploy.sass"></a>

### @studyportals/product-deploy.sass
**Kind**: static constant of [<code>@studyportals/product-deploy</code>](#module_@studyportals/product-deploy)  
**See**: [@studyportals/sass](https://www.npmjs.com/package/@studyportals/sass)  
<a name="module_@studyportals/product-deploy.js"></a>

### @studyportals/product-deploy.js
**Kind**: static constant of [<code>@studyportals/product-deploy</code>](#module_@studyportals/product-deploy)  
**See**: [lib/js](#module_lib/js)  
<a name="module_lib/ensureDir"></a>

## lib/ensureDir
<a name="exp_module_lib/ensureDir--ensureDir"></a>

### ensureDir(dir) ⇒ <code>Promise</code> ⏏
**Kind**: Exported function  
**See**: https://www.npmjs.com/package/mkdirp  

| Param | Type | Description |
| --- | --- | --- |
| dir | <code>string</code> | The directory |

<a name="module_lib/js"></a>

## lib/js
<a name="module_lib/js.compile"></a>

### lib/js.compile([opts])
Compiles ES6 js into uglified ES2015 js.

**Kind**: static method of [<code>lib/js</code>](#module_lib/js)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [opts] | <code>Object</code> |  |  |
| [opts.from] | <code>String</code> \| <code>Array</code> | <code>*.js</code> | Glob |
| [opts.to] | <code>String</code> | <code>process.cwd()</code> |  |
| [opts.uglify] | <code>String</code> | <code>true</code> |  |

<a name="module_lib/log"></a>

## ~~lib/log~~
***Deprecated***

Use `@studyportals/node-log` instead.

**See**: [@studyportals/node-log](https://www.npmjs.com/package/@studyportals/node-log)  
**Todo**

- [ ] remove in next major release

<a name="module_lib/prepare"></a>

## lib/prepare
<a name="module_lib/prepare.ensureEmptyDir"></a>

### lib/prepare.ensureEmptyDir(dir) ⇒ <code>Promise</code>
Ensures the directory exists and is empty.

Essentially it removes and re-created the directory.

**Kind**: static method of [<code>lib/prepare</code>](#module_lib/prepare)  
**See**

- [lib/rimraf](#module_lib/rimraf)
- [lib/mkdirp](#module_lib/mkdirp)


| Param | Type | Description |
| --- | --- | --- |
| dir | <code>string</code> | The directory |

<a name="module_lib/rimraf"></a>

## lib/rimraf
<a name="exp_module_lib/rimraf--rimraf"></a>

### rimraf(glob) ⇒ <code>Promise</code> ⏏
The UNIX command `rm -rf` for node.

It will ask the use (console) to retry when the glob cannot be removed due to
an `EBUSY` error.

**Kind**: Exported function  
**See**: https://www.npmjs.com/package/rimraf  

| Param | Type | Description |
| --- | --- | --- |
| glob | <code>string</code> | The glob to delete |


_README.md generated at: Wed Jul 26 2017 12:29:11 GMT+0200 (W. Europe Daylight Time)_