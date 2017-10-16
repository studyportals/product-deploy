# @studyportals/product-deploy@v3.0.0-RC.4

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
<dt><a href="#SimplePageTester">SimplePageTester</a> : <code><a href="#SimplePageTester">SimplePageTester</a></code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#attachToGulp">attachToGulp(gulp)</a></dt>
<dd><p>Attach the deploy tasks to gulp</p>
<p>Tasks:</p>
<ul>
<li>watch.cms</li>
<li>deploy.cms</li>
<li>deploy.servicelayer</li>
</ul>
<p>Behaviour can be changed by changing these env vars:</p>
<ul>
<li>process.env.PRTL_ENV - Set the portal environment; @see lib/private/env</li>
<li>process.env.PRTL_DEPLOYLOG_ENDPOINT - The endpoint to which to send deploylogs.</li>
</ul>
</dd>
</dl>

<a name="module_@studyportals/product-deploy"></a>

## @studyportals/product-deploy
<a name="SimplePageTester"></a>

## SimplePageTester : [<code>SimplePageTester</code>](#SimplePageTester)
**Kind**: global class  

* [SimplePageTester](#SimplePageTester) : [<code>SimplePageTester</code>](#SimplePageTester)
    * [new SimplePageTester(repo, url)](#new_SimplePageTester_new)
    * [.run(pages)](#SimplePageTester+run)

<a name="new_SimplePageTester_new"></a>

### new SimplePageTester(repo, url)

| Param | Type | Description |
| --- | --- | --- |
| repo | <code>String</code> | Name of the GitHub repository |
| url | <code>String</code> | The base url to test. |

<a name="SimplePageTester+run"></a>

### simplePageTester.run(pages)
Executes simple accessibility tests to the specified pages.

If the pages cannot be reached, the test will be marked as failed.

**Kind**: instance method of [<code>SimplePageTester</code>](#SimplePageTester)  

| Param | Type | Description |
| --- | --- | --- |
| pages | <code>Array.&lt;String&gt;</code> | List of pages to test for statuscode 200 |

<a name="attachToGulp"></a>

## attachToGulp(gulp)
Attach the deploy tasks to gulp

Tasks:
- watch.cms
- deploy.cms
- deploy.servicelayer

Behaviour can be changed by changing these env vars:
- process.env.PRTL_ENV - Set the portal environment; @see lib/private/env
- process.env.PRTL_DEPLOYLOG_ENDPOINT - The endpoint to which to send deploylogs.

**Kind**: global function  

| Param | Type |
| --- | --- |
| gulp | <code>Gulp</code> | 


_README.md generated at: Mon Oct 16 2017 16:31:44 GMT+0200 (CEST)_