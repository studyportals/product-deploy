"use strict";

/**
 * Use `@studyportals/node-log` instead.
 * @deprecated
 * @see {@link https://www.npmjs.com/package/@studyportals/node-log|@studyportals/node-log}
 * @todo: remove in next major release
 * @module lib/log
 */

const log = require('@studyportals/node-log');
log.debug('@studyportals/product-deploy/lib/log is deprecated, please use ' +
	'@studyportals/node-log instead');

module.exports = log;