"use strict";

const path = require('path');
const fs = require('fs-extra');
const log = require('@studyportals/node-log');

/**
 * @param {Object} opts
 * @param {string} [opts.from]
 * @param {string} opts.to
 * @return {Promise}
 */
const assemble = (opts) => {

	const defaults = {
		'from': process.cwd(),
		'to': null,
	};
	opts = Object.assign(defaults, opts);

	log.info(`Assemble: ${opts.from} => ${opts.to}`);

	const copyOptions = {
		filter: (path) =>{

			const regExToExclude = /[\\\/](\.git|\.idea|sonar-project\.pro|node_modules)/i;
			return !regExToExclude.test(path);
		}
	};

	return fs.copy(opts.from, opts.to, copyOptions);
};

module.exports = assemble;