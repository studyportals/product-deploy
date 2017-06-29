# @studyportals/product-deploy@v1.2.0-RC.2

<a href="https://www.npmjs.com/package/@studyportals/product-deploy" title="View this project on NPM" target="_blank"><img src="https://img.shields.io/npm/v/@studyportals/product-deploy.svg?style=flat" alt="NPM version" /></a>
<a href="https://www.npmjs.com/package/@studyportals/product-deploy" title="View this project on NPM" target="_blank"><img src="https://img.shields.io/npm/l/@studyportals/product-deploy.svg?style=flat" alt="NPM license" /></a>
<a href="https://www.npmjs.com/package/@studyportals/product-deploy" title="View this project on NPM" target="_blank"><img src="https://img.shields.io/npm/dm/@studyportals/product-deploy.svg?style=flat" alt="NPM downloads" /></a>
<a href="https://david-dm.org/studyportals/product-deploy" title="View this project on David" target="_blank"><img src="https://img.shields.io/david/studyportals/product-deploy.svg?style=flat" alt="Dependencies" /></a>
<a href="https://david-dm.org/studyportals/product-deploy" title="View this project on David" target="_blank"><img src="https://img.shields.io/david/dev/studyportals/product-deploy.svg?style=flat" alt="Development Dependencies" /></a>

Toolset to deploy StudyPortals products

## Modules

<dl>
<dt><a href="#module_bower">bower</a></dt>
<dd></dd>
<dt><a href="#module_composer">composer</a></dt>
<dd></dd>
<dt><a href="#module_log">log</a></dt>
<dd><p>Handles console logs
The default verbosity level is: <code>process.env[&#39;VERBOSITY&#39;] || VERBOSITY.WARNING;</code></p>
</dd>
</dl>

<a name="module_bower"></a>

## bower
<a name="exp_module_bower--install"></a>

### install([opts]) ⇒ <code>Promise</code> ⏏
Bower dependencies will be installed only if a bower.json exists.The installation will complete, without applying any changes, when no`bower.json` file is found.

**Kind**: Exported function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [opts] | <code>Object</code> |  |  |
| [opts.cwd] | <code>string</code> | <code>&quot;process.cwd()&quot;</code> | Directory in which to execute bower install. |

<a name="module_composer"></a>

## composer
<a name="exp_module_composer--install"></a>

### install([opts]) ⇒ <code>Promise</code> ⏏
Composer dependencies will be installed only if a composer.json exists.The installation will complete, without applying any changes, when no`composer.json` file is found.

**Kind**: Exported function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [opts] | <code>Object</code> |  |  |
| [opts.cwd] | <code>string</code> | <code>&quot;process.cwd()&quot;</code> | Directory in which to execute composer install. |

<a name="module_log"></a>

## log
Handles console logsThe default verbosity level is: `process.env['VERBOSITY'] || VERBOSITY.WARNING;`


* [log](#module_log)
    * [VERBOSITY](#exp_module_log--VERBOSITY) : <code>enum</code> ⏏
    * [setVerbosity(x)](#exp_module_log--setVerbosity) ⇒ ⏏
    * [debug(message)](#exp_module_log--debug) ⇒ ⏏
    * [info(message)](#exp_module_log--info) ⇒ ⏏
    * [warning(message)](#exp_module_log--warning) ⇒ ⏏
    * [error(message)](#exp_module_log--error) ⇒ ⏏

<a name="exp_module_log--VERBOSITY"></a>

### VERBOSITY : <code>enum</code> ⏏
Default options for verbosity

**Kind**: Exported enum  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| NONE | <code>number</code> | <code>0</code> | 
| ERROR | <code>number</code> | <code>1</code> | 
| WARNING | <code>number</code> | <code>2</code> | 
| INFO | <code>number</code> | <code>3</code> | 
| DEBUG | <code>number</code> | <code>4</code> | 
| ALL | <code>number</code> | <code>4</code> | 

<a name="exp_module_log--setVerbosity"></a>

### setVerbosity(x) ⇒ ⏏
Set the verbosity level

**Kind**: Exported function  
**Returns**: void  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>VERBOSITY</code> \| <code>number</code> | Verbosity level |

<a name="exp_module_log--debug"></a>

### debug(message) ⇒ ⏏
Debug message (gray)

**Kind**: Exported function  
**Returns**: void  

| Param | Type |
| --- | --- |
| message | <code>string</code> | 

<a name="exp_module_log--info"></a>

### info(message) ⇒ ⏏
Info message (white)

**Kind**: Exported function  
**Returns**: void  

| Param | Type |
| --- | --- |
| message | <code>string</code> | 

<a name="exp_module_log--warning"></a>

### warning(message) ⇒ ⏏
Warning message (yellow)

**Kind**: Exported function  
**Returns**: void  

| Param | Type |
| --- | --- |
| message | <code>string</code> | 

<a name="exp_module_log--error"></a>

### error(message) ⇒ ⏏
Error message (red)

**Kind**: Exported function  
**Returns**: void  

| Param | Type |
| --- | --- |
| message | <code>string</code> | 


_README.md generated at: Thu Jun 29 2017 11:06:52 GMT+0800 (China Standard Time)_