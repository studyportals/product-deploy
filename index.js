"use strict";

/**
 * @module @studyportals/product-deploy
 */

require('./lib/private/check-for-update');
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

/**
 * @static
 * @see {@link #module_lib/SimplePageTester|lib/SimplePageTester}
 */
const SimplePageTester = require('./lib/simple-page-tester');

module.exports = {
	attachToGulp,
	Deploy,
	SimplePageTester,
};