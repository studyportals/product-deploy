# @studyportals/product-deploy@v1.3.0-RC.4

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
<dt><a href="#module_lib/bower">lib/bower</a></dt>
<dd></dd>
<dt><a href="#module_lib/ensureDir">lib/ensureDir</a></dt>
<dd></dd>
<dt><a href="#module_lib/log">lib/log</a></dt>
<dd></dd>
<dt><a href="#module_lib/prepare">lib/prepare</a></dt>
<dd></dd>
<dt><a href="#module_lib/rimraf">lib/rimraf</a></dt>
<dd></dd>
</dl>

<a name="module_@studyportals/product-deploy"></a>

## @studyportals/product-deploy

* [@studyportals/product-deploy](#module_@studyportals/product-deploy)
    * [.bower](#module_@studyportals/product-deploy.bower)
    * [.composer](#module_@studyportals/product-deploy.composer)
    * [.log](#module_@studyportals/product-deploy.log)
    * [.prepare](#module_@studyportals/product-deploy.prepare)

<a name="module_@studyportals/product-deploy.bower"></a>

### @studyportals/product-deploy.bower
**Kind**: static constant of [<code>@studyportals/product-deploy</code>](#module_@studyportals/product-deploy)  
**See**: [lib/bower](#module_lib/bower)  
<a name="module_@studyportals/product-deploy.composer"></a>

### @studyportals/product-deploy.composer
**Kind**: static constant of [<code>@studyportals/product-deploy</code>](#module_@studyportals/product-deploy)  
**See**: [@studyportals/composer](https://www.npmjs.com/package/@studyportals/composer)  
<a name="module_@studyportals/product-deploy.log"></a>

### @studyportals/product-deploy.log
**Kind**: static constant of [<code>@studyportals/product-deploy</code>](#module_@studyportals/product-deploy)  
**See**: [lib/log](#module_lib/log)  
<a name="module_@studyportals/product-deploy.prepare"></a>

### @studyportals/product-deploy.prepare
**Kind**: static constant of [<code>@studyportals/product-deploy</code>](#module_@studyportals/product-deploy)  
**See**: [lib/prepare](#module_lib/prepare)  
<a name="module_lib/bower"></a>

## lib/bower
<a name="module_lib/bower.install"></a>

### lib/bower.install([opts]) ⇒ <code>Promise</code>
Bower dependencies will be installed only if a bower.json exists.

The installation will complete, without applying any changes, when no
`bower.json` file is found.

**Kind**: static method of [<code>lib/bower</code>](#module_lib/bower)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [opts] | <code>Object</code> |  |  |
| [opts.cwd] | <code>string</code> | <code>&quot;process.cwd()&quot;</code> | Directory in which to execute bower install. |

<a name="module_lib/ensureDir"></a>

## lib/ensureDir
<a name="exp_module_lib/ensureDir--ensureDir"></a>

### ensureDir(dir) ⇒ <code>Promise</code> ⏏
**Kind**: Exported function  
**See**: https://www.npmjs.com/package/mkdirp  

| Param | Type | Description |
| --- | --- | --- |
| dir | <code>string</code> | The directory |

<a name="module_lib/log"></a>

## lib/log

* [lib/log](#module_lib/log)
    * [.VERBOSITY](#module_lib/log.VERBOSITY) : <code>enum</code>
    * [.setVerbosity(x)](#module_lib/log.setVerbosity) ⇒
    * [.debug(message)](#module_lib/log.debug) ⇒
    * [.info(message)](#module_lib/log.info) ⇒
    * [.warning(message)](#module_lib/log.warning) ⇒
    * [.error(message)](#module_lib/log.error) ⇒

<a name="module_lib/log.VERBOSITY"></a>

### lib/log.VERBOSITY : <code>enum</code>
Default options for verbosity

**Kind**: static enum of [<code>lib/log</code>](#module_lib/log)  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| NONE | <code>number</code> | <code>0</code> | 
| ERROR | <code>number</code> | <code>1</code> | 
| WARNING | <code>number</code> | <code>2</code> | 
| INFO | <code>number</code> | <code>3</code> | 
| DEBUG | <code>number</code> | <code>4</code> | 
| ALL | <code>number</code> | <code>4</code> | 

<a name="module_lib/log.setVerbosity"></a>

### lib/log.setVerbosity(x) ⇒
Set the verbosity level.

The default verbosity level is: `process.env['VERBOSITY'] || VERBOSITY.WARNING;`

**Kind**: static method of [<code>lib/log</code>](#module_lib/log)  
**Returns**: void  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>VERBOSITY</code> \| <code>number</code> | Verbosity level |

<a name="module_lib/log.debug"></a>

### lib/log.debug(message) ⇒
Debug message (gray)

**Kind**: static method of [<code>lib/log</code>](#module_lib/log)  
**Returns**: void  

| Param | Type |
| --- | --- |
| message | <code>string</code> | 

<a name="module_lib/log.info"></a>

### lib/log.info(message) ⇒
Info message (white)

**Kind**: static method of [<code>lib/log</code>](#module_lib/log)  
**Returns**: void  

| Param | Type |
| --- | --- |
| message | <code>string</code> | 

<a name="module_lib/log.warning"></a>

### lib/log.warning(message) ⇒
Warning message (yellow)

**Kind**: static method of [<code>lib/log</code>](#module_lib/log)  
**Returns**: void  

| Param | Type |
| --- | --- |
| message | <code>string</code> | 

<a name="module_lib/log.error"></a>

### lib/log.error(message) ⇒
Error message (red)

**Kind**: static method of [<code>lib/log</code>](#module_lib/log)  
**Returns**: void  

| Param | Type |
| --- | --- |
| message | <code>string</code> | 

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


_README.md generated at: Tue Jul 11 2017 12:41:31 GMT+0800 (China Standard Time)_