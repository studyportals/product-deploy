"use strict";

/**
 * @module @studyportals/product-deploy
 */

/**
 * @static
 * @see {@link https://www.npmjs.com/package/@studyportals/node-log|@studyportals/node-log}
 */
const log = require('@studyportals/node-log');

/**
 * @static
 * @see {@link #module_lib/prepare|lib/prepare}
 */
const prepare = require('./lib/prepare');

/**
 * @static
 * @see {@link https://www.npmjs.com/package/@studyportals/bower|@studyportals/bower}
 */
const bower = require('@studyportals/bower');

/**
 * @static
 * @see {@link https://www.npmjs.com/package/@studyportals/composer|@studyportals/composer}
 */
const composer = require('@studyportals/composer');

/**
 * @static
 * @see {@link https://www.npmjs.com/package/@studyportals/sass|@studyportals/sass}
 */
const sass = require('@studyportals/sass');

/**
 * @static
 * @see {@link #module_lib/js|lib/js}
 */
const js = require('./lib/js');

/**
 * @static
 * @see {@link #module_lib/siteDB|lib/siteDB}
 */
const siteDB = require('./lib/siteDB');

module.exports = {
	log,
	prepare,
	bower,
	composer,
	sass,
	js,
	siteDB,
};