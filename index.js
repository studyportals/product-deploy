"use strict";

/**
 * @module @studyportals/product-deploy
 */

require('./lib/private/config');
require('./lib/private/check-for-update');

module.exports = {
	attachToGulp: require('./lib/attachToGulp'),
	Deploy: require('./lib/deploy'),
	SimplePageTester: require('./lib/simple-page-tester'),
};