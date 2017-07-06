"use strict";

/**
 * @module @studyportals/product-deploy
 */

/**
 * @static
 */
const bower = require('./lib/bower');

/**
 * @static
 */
const composer = require('./lib/composer');

/**
 * @static
 */
const log = require('./lib/log');

/**
 * @static
 */
const prepare = require('./lib/prepare');

module.exports = {
	bower,
	composer,
	log,
	prepare
};