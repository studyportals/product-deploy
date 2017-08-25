"use strict";

/**
 * @module @studyportals/product-deploy
 */

/**
 * @static
 * @see {@link #module_lib/attachToGulp|lib/attachToGulp}
 */
const attachToGulp = require('./lib/attachToGulp');

/**
 * @static
 * @see {@link #module_lib/portal|lib/portal}
 */
const Portal = require('./lib/deploy');

module.exports = {
	attachToGulp,
	Portal
};