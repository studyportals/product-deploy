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
 * @see {@link #module_lib/composer|lib/composer}
 */
const composer = require('./lib/composer');

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