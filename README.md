# @studyportals/product-deploy@v2.0.0-alpha.4

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
</dl>

## Classes

<dl>
<dt><a href="#Portal">Portal</a> : <code><a href="#Portal">Portal</a></code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#attachToGulp">attachToGulp(gulp, opts)</a></dt>
<dd><p>Overwrite gulp tasks from <code>@prtl/local-deploy-portal-spici</code></p>
<p>This file is used to overwrite already existing gulp tasks from our private
<code>@prtl/local-deploy-portal-spici</code>. Therefore it is also an intermediate state
until we can fully rely on this package for our deploys. Once all the steps
are rewritten we can simply expose one method per type of deploy and call that
from the main <code>Gulpfile.js</code></p>
</dd>
</dl>

<a name="module_@studyportals/product-deploy"></a>

## @studyportals/product-deploy

* [@studyportals/product-deploy](#module_@studyportals/product-deploy)
    * [.attachToGulp](#module_@studyportals/product-deploy.attachToGulp)
    * [.Portal](#module_@studyportals/product-deploy.Portal)

<a name="module_@studyportals/product-deploy.attachToGulp"></a>

### @studyportals/product-deploy.attachToGulp
**Kind**: static constant of [<code>@studyportals/product-deploy</code>](#module_@studyportals/product-deploy)  
**See**: [lib/attachToGulp](#module_lib/attachToGulp)  
<a name="module_@studyportals/product-deploy.Portal"></a>

### @studyportals/product-deploy.Portal
**Kind**: static constant of [<code>@studyportals/product-deploy</code>](#module_@studyportals/product-deploy)  
**See**: [lib/portal](#module_lib/portal)  
<a name="Portal"></a>

## Portal : [<code>Portal</code>](#Portal)
**Kind**: global class  

* [Portal](#Portal) : [<code>Portal</code>](#Portal)
    * [new Portal(opts)](#new_Portal_new)
    * [.workingCopy()](#Portal+workingCopy) ⇒ <code>Promise</code>
    * [.full(gulp)](#Portal+full) ⇒ <code>Promise</code>

<a name="new_Portal_new"></a>

### new Portal(opts)

| Param | Type | Default |
| --- | --- | --- |
| opts | <code>Object</code> |  | 
| opts.to | <code>string</code> |  | 
| [opts.from] | <code>string</code> | <code>&quot;current working directory&quot;</code> | 
| [opts.env] | <code>string</code> | <code>&quot;Testing&quot;</code> | 

<a name="Portal+workingCopy"></a>

### portal.workingCopy() ⇒ <code>Promise</code>
Deploy based on the current folder.

**Kind**: instance method of [<code>Portal</code>](#Portal)  
<a name="Portal+full"></a>

### portal.full(gulp) ⇒ <code>Promise</code>
Full deployIt will clone the repository from github and executes a fresh deploy.

**Kind**: instance method of [<code>Portal</code>](#Portal)  

| Param | Type |
| --- | --- |
| gulp | <code>Gulp</code> | 

<a name="attachToGulp"></a>

## attachToGulp(gulp, opts)
Overwrite gulp tasks from `@prtl/local-deploy-portal-spici`

This file is used to overwrite already existing gulp tasks from our private
`@prtl/local-deploy-portal-spici`. Therefore it is also an intermediate state
until we can fully rely on this package for our deploys. Once all the steps
are rewritten we can simply expose one method per type of deploy and call that
from the main `Gulpfile.js`

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| gulp | <code>Gulp</code> |  | 
| opts | <code>Object</code> |  | 
| opts.buildDir | <code>string</code> |  | 
| [opts.env] | <code>String</code> | <code>Testing</code> | 


_README.md generated at: Fri Aug 25 2017 13:05:07 GMT+0200 (W. Europe Daylight Time)_