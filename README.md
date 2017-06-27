# @studyportals/product-deploy@v1.1.3-2

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
<dt><a href="#module_log">log</a></dt>
<dd></dd>
</dl>

<a name="module_bower"></a>

## bower
<a name="module_bower..install"></a>

### bower~install([opts]) ⇒ <code>Promise</code>
Install bower dependencies.

**Kind**: inner method of [<code>bower</code>](#module_bower)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [opts] | <code>Object</code> |  |  |
| [opts.cwd] | <code>string</code> | <code>&quot;process.cwd()&quot;</code> | current working directory |

<a name="module_log"></a>

## log

* [log](#module_log)
    * [~setVerbosity(x)](#module_log..setVerbosity) ⇒
    * [~debug(message)](#module_log..debug) ⇒
    * [~info(message)](#module_log..info) ⇒
    * [~warning(message)](#module_log..warning) ⇒
    * [~error(message)](#module_log..error) ⇒

<a name="module_log..setVerbosity"></a>

### log~setVerbosity(x) ⇒
Verbosity levels:- 0: No output- 1: Error output- 2: Warning output- 3: Info output- 4: Debug outputDefault verbosity level can be overridden by setting the env var `VERBOSITY`

**Kind**: inner method of [<code>log</code>](#module_log)  
**Returns**: void  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>integer</code> | Verbosity level |

<a name="module_log..debug"></a>

### log~debug(message) ⇒
Debug message (gray)

**Kind**: inner method of [<code>log</code>](#module_log)  
**Returns**: void  

| Param | Type |
| --- | --- |
| message | <code>string</code> | 

<a name="module_log..info"></a>

### log~info(message) ⇒
Info message (white)

**Kind**: inner method of [<code>log</code>](#module_log)  
**Returns**: void  

| Param | Type |
| --- | --- |
| message | <code>string</code> | 

<a name="module_log..warning"></a>

### log~warning(message) ⇒
Warning message (yellow)

**Kind**: inner method of [<code>log</code>](#module_log)  
**Returns**: void  

| Param | Type |
| --- | --- |
| message | <code>string</code> | 

<a name="module_log..error"></a>

### log~error(message) ⇒
Error message (red)

**Kind**: inner method of [<code>log</code>](#module_log)  
**Returns**: void  

| Param | Type |
| --- | --- |
| message | <code>string</code> | 


_README.md generated at: Tue Jun 27 2017 14:56:00 GMT+0800 (China Standard Time)_