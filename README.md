# @studyportals/product-deploy@v2.2.0-alpha.3

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
<dd><p>Attach the deploy tasks to gulp</p>
<p>Tasks:</p>
<ul>
<li>deploy.cms.workingcopy</li>
<li>deploy.servicelayer</li>
<li>deploy.servicelayer.codebuild</li>
</ul>
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
    * [.sass()](#Deploy+sass) ⇒ <code>Promise</code>
    * [.js()](#Deploy+js) ⇒ <code>Promise</code>
    * [.startWatchers()](#Deploy+startWatchers)

<a name="new_Deploy_new"></a>

### new Deploy(opts)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| opts | <code>Object</code> |  |  |
| [opts.from] | <code>string</code> | <code>&quot;process.cwd()&quot;</code> | Source folder |
| opts.to | <code>string</code> |  | Deploy folder |
| [opts.gulp] | <code>Gulp</code> |  |  |

<a name="Deploy+assemble"></a>

### deploy.assemble() ⇒ <code>Promise</code>
Copy the folder `opts.from` into `opts.to`

- excludes certain files like .git, node_modules etc.
- writes an revision.json containing the product name, timestamp and
dependencies

**Kind**: instance method of [<code>Deploy</code>](#Deploy)  
<a name="Deploy+configure"></a>

### deploy.configure() ⇒ <code>Promise</code>
Copy the configuration from `opts.from` into `opts.to`.

It expects a folder structure like this:
- Deploy/Config/Development
- Deploy/Config/Live
- Deploy/Config/Staging
- Deploy/Config/Testing

The Live config is always copied, the environment specific folder only
if `process.env.PRTL_ENV` is set and differs from `Poduction` or `Live`

**Kind**: instance method of [<code>Deploy</code>](#Deploy)  
<a name="Deploy+composer"></a>

### deploy.composer() ⇒ <code>Promise</code>
Install composer dependencies in the `opts.from` folder.

**Kind**: instance method of [<code>Deploy</code>](#Deploy)  
<a name="Deploy+prepare"></a>

### deploy.prepare() ⇒ <code>Promise</code>
Prepares the deploy location

It makes sure the folder exists and is empty.

**Kind**: instance method of [<code>Deploy</code>](#Deploy)  
<a name="Deploy+sass"></a>

### deploy.sass() ⇒ <code>Promise</code>
Compile scss files into css.

Takes all `*.scss` files excluding the folders:
- test
- bower_components
- node_modules

**Kind**: instance method of [<code>Deploy</code>](#Deploy)  
<a name="Deploy+js"></a>

### deploy.js() ⇒ <code>Promise</code>
Compile js files (babel and uglify)

Takes all `*.js` files excluding the folders:
- test
- bower_component
- node_modules

First it will pipe them through babel. When `Deploy.enableCompression` is
true it will also uglyfies them.

**Kind**: instance method of [<code>Deploy</code>](#Deploy)  
<a name="Deploy+startWatchers"></a>

### deploy.startWatchers()
Start the file watchers

- js
- scss
- file

**Kind**: instance method of [<code>Deploy</code>](#Deploy)  
<a name="attachToGulp"></a>

## attachToGulp(gulp, opts)
Attach the deploy tasks to gulp

Tasks:
- deploy.cms.workingcopy
- deploy.servicelayer
- deploy.servicelayer.codebuild

**Kind**: global function  

| Param | Type |
| --- | --- |
| gulp | <code>Gulp</code> | 
| opts | <code>Object</code> | 
| opts.buildDir | <code>string</code> | 


_README.md generated at: Wed Sep 13 2017 12:32:20 GMT+0200 (W. Europe Daylight Time)_