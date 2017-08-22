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
 * @see {@link #module_lib/configure|lib/configure}
 */
const configure = require('./lib/configure');

/**
 * @static
 * @see {@link #module_lib/assemble|lib/assemble}
 */
const assemble = require('./lib/assemble');

/**
 * @static
 * @see {@link #module_lib/attachToGulp|lib/attachToGulp}
 */
const attachToGulp = require('./lib/attachToGulp');

module.exports = {
	log,
	prepare,
	composer,
	sass,
	js,
	configure,
	assemble,
	attachToGulp
};