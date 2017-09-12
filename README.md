# @studyportals/product-deploy@v2.1.5-0

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
<dt><a href="#Deploy">Deploy</a> : <code><a href="#Deploy">Deploy</a></code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#attachToGulp">attachToGulp(gulp, opts)</a></dt>
<dd><p>Attach the deploy to the gulp task <code>deploy.cms.workingcopy</code>.</p>
</dd>
</dl>

<a name="module_@studyportals/product-deploy"></a>

## @studyportals/product-deploy

* [@studyportals/product-deploy](#module_@studyportals/product-deploy)
    * [.attachToGulp](#module_@studyportals/product-deploy.attachToGulp)
    * [.Deploy](#module_@studyportals/product-deploy.Deploy)

<a name="module_@studyportals/product-deploy.attachToGulp"></a>

### @studyportals/product-deploy.attachToGulp
**Kind**: static constant of [<code>@studyportals/product-deploy</code>](#module_@studyportals/product-deploy)  
**See**: [lib/attachToGulp](#module_lib/attachToGulp)  
<a name="module_@studyportals/product-deploy.Deploy"></a>

### @studyportals/product-deploy.Deploy
**Kind**: static constant of [<code>@studyportals/product-deploy</code>](#module_@studyportals/product-deploy)  
**See**: [lib/Deploy](#module_lib/Deploy)  
<a name="Deploy"></a>

## Deploy : [<code>Deploy</code>](#Deploy)
**Kind**: global class  

* [Deploy](#Deploy) : [<code>Deploy</code>](#Deploy)
    * [new Deploy(opts)](#new_Deploy_new)
    * [.assemble()](#Deploy+assemble) ⇒ <code>Promise</code>
    * [.configure()](#Deploy+configure) ⇒ <code>Promise</code>
    * [.composer()](#Deploy+composer) ⇒ <code>Promise</code>
    * [.prepare()](#Deploy+prepare) ⇒ <code>Promise</code>
    * [.workingCopy()](#Deploy+workingCopy) ⇒ <code>Promise</code>

<a name="new_Deploy_new"></a>

### new Deploy(opts)

| Param | Type | Default |
| --- | --- | --- |
| opts | <code>Object</code> |  | 
| opts.to | <code>string</code> |  | 
| [opts.from] | <code>string</code> | <code>&quot;current working directory&quot;</code> | 
| [opts.gulp] | <code>Gulp</code> |  | 

<a name="Deploy+assemble"></a>

### deploy.assemble() ⇒ <code>Promise</code>
Assemble the portal into the deploy location.

**Kind**: instance method of [<code>Deploy</code>](#Deploy)  
<a name="Deploy+configure"></a>

### deploy.configure() ⇒ <code>Promise</code>
Copy the configuration.

**Kind**: instance method of [<code>Deploy</code>](#Deploy)  
<a name="Deploy+composer"></a>

### deploy.composer() ⇒ <code>Promise</code>
Install _composer dependencies

**Kind**: instance method of [<code>Deploy</code>](#Deploy)  
<a name="Deploy+prepare"></a>

### deploy.prepare() ⇒ <code>Promise</code>
Make sure the deploy location exists and is empty.

**Kind**: instance method of [<code>Deploy</code>](#Deploy)  
<a name="Deploy+workingCopy"></a>

### deploy.workingCopy() ⇒ <code>Promise</code>
Deploy based on the current folder.

**Kind**: instance method of [<code>Deploy</code>](#Deploy)  
<a name="attachToGulp"></a>

## attachToGulp(gulp, opts)
Attach the deploy to the gulp task `deploy.cms.workingcopy`.

**Kind**: global function  

| Param | Type |
| --- | --- |
| gulp | <code>Gulp</code> | 
| opts | <code>Object</code> | 
| opts.buildDir | <code>string</code> | 


_README.md generated at: Tue Sep 12 2017 15:29:56 GMT+0200 (W. Europe Daylight Time)_