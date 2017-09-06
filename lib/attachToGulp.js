"use strict";

/**
 * Attach the deploy to the gulp task `deploy.cms.workingcopy`.
 *
 * @param {Gulp} gulp
 * @param {Object} opts
 * @param {string} opts.buildDir
 */
const attachToGulp = (gulp, opts) =>{

	const Portal = new (require('./private/deploy'))({
		to: opts.buildDir,
		gulp: gulp
	});

	gulp.task('deploy.cms.workingcopy', () =>{
		return Portal.workingCopy()
			.then(() => { Portal.startWatchers(); });
	});
};

module.exports = attachToGulp;