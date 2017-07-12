"use strict";

/**
 * @module @studyportals/product-deploy
 */

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
 * Use `@studyportals/node-log` instead.
 * @deprecated
 * @see {@link https://www.npmjs.com/package/@studyportals/node-log|@studyportals/node-log}
 *
 * @static
 * @private
 * @see {@link #module_lib/log|lib/log}
 */
const log = require('./lib/log');

/**
 * @static
 * @see {@link #module_lib/prepare|lib/prepare}
 */
const prepare = require('./lib/prepare');

module.exports = {
	bower,
	composer,
	log,
	prepare
};