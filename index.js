"use strict";

/**
 * @module @studyportals/product-deploy
 */

/**
 * @static
 * @see {@link #lib/bower|lib/bower}
 */
const bower = require('./lib/bower');

/**
 * @static
 * @see {@link #lib/composer|lib/composer}
 */
const composer = require('./lib/composer');

/**
 * @static
 * @see {@link #lib/log|lib/log}
 */
const log = require('./lib/log');

/**
 * @static
 * @see {@link #lib/prepare|lib/prepare}
 */
const prepare = require('./lib/prepare');

module.exports = {
	bower,
	composer,
	log,
	prepare
};