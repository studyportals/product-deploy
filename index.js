"use strict";

/**
 * @module @studyportals/product-deploy
 */

/**
 * @static
 * @see {@link #module_lib/bower|lib/bower}
 */
const bower = require('./lib/bower');

/**
 * @static
 * @see {@link https://www.npmjs.com/package/@studyportals/composer|@studyportals/composer}
 */
const composer = require('@studyportals/composer');

/**
 * @static
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