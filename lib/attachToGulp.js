"use strict";

const env = require('./private/env');
const log = require('@studyportals/node-log');
const pjson = require('./../package.json');

/**
 * Overwrite gulp tasks from `@prtl/local-deploy-portal-spici`
 *
 * This file is used to overwrite already existing gulp tasks from our private
 * `@prtl/local-deploy-portal-spici`. Therefore it is also an intermediate state
 * until we can fully rely on this package for our deploys. Once all the steps
 * are rewritten we can simply expose one method per type of deploy and call that
 * from the main `Gulpfile.js`
 *
 * @param {Gulp} gulp
 * @param {Object} opts
 * @param {string} opts.buildDir
 * @param {String} [opts.env=Testing]
 */
const attachToGulp = (gulp, opts) =>{

	log.debug(`Using ${pjson.name}@${pjson.version}`);

	require('./private/deploylog').attachToGulp(gulp);

	const defaults = {
		'env': env.TST
	};
	opts = Object.assign(defaults, opts);

	if(opts.env === 'Live'){

		log.warning(`env 'Live' is used while 'Production' is expected, rewritten to 'Production'`);
		opts.env = env.PRD;
	}

	opts.enableCompression = opts.env === env.PRD || opts.env === env.STG;

	const Portal = new (require('./deploy'))({
		to: opts.buildDir,
		env: opts.env,
		gulp: gulp
	});

	gulp.task('deploy.cms.workingcopy', () =>{
		return Portal.workingCopy()
			.then(() => { Portal.startWatchers(); });
	});

	gulp.task('deploy.cms.full', () =>{
		return Portal.full();
	});
};

module.exports = attachToGulp;