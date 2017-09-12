"use strict";

/**
 * @module @studyportals/product-deploy
 */

require('./lib/private/config');

/**
 * @static
 * @see {@link #module_lib/attachToGulp|lib/attachToGulp}
 */
const attachToGulp = require('./lib/attachToGulp');

/**
 * @static
 * @see {@link #module_lib/Deploy|lib/Deploy}
 */
const Deploy = require('./lib/deploy');

module.exports = {
	attachToGulp,
	Deploy
};