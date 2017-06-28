# @studyportals/product-deploy@v1.1.3-10

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
<dd></dd>
</dl>

<a name="module_bower"></a>

## bower
<a name="exp_module_bower--install"></a>

### install([opts]) ⇒ <code>Promise</code> ⏏
Install bower dependencies.

**Kind**: Exported function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [opts] | <code>Object</code> |  |  |
| [opts.cwd] | <code>string</code> | <code>&quot;process.cwd()&quot;</code> | current working directory |

<a name="module_composer"></a>

## composer
<a name="exp_module_composer--install"></a>

### install([opts]) ⇒ <code>Promise</code> ⏏
Install composer dependencies.

**Kind**: Exported function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [opts] | <code>Object</code> |  |  |
| [opts.cwd] | <code>string</code> | <code>&quot;process.cwd()&quot;</code> | current working directory |

<a name="module_log"></a>

## log

* [log](#module_log)
    * [setVerbosity(x)](#exp_module_log--setVerbosity) ⇒ ⏏
    * [debug(message)](#exp_module_log--debug) ⇒ ⏏
    * [info(message)](#exp_module_log--info) ⇒ ⏏
    * [warning(message)](#exp_module_log--warning) ⇒ ⏏

<a name="exp_module_log--setVerbosity"></a>

### setVerbosity(x) ⇒ ⏏
Set the verbosity level- 0: No output- 1: Error output- 2: Warning output- 3: Info output- 4: Debug outputDefault verbosity level can be overridden by setting the env var `VERBOSITY`

**Kind**: Exported function  
**Returns**: void  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | Verbosity level |

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


_README.md generated at: Wed Jun 28 2017 13:15:37 GMT+0800 (China Standard Time)_