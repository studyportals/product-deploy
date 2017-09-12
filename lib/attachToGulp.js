"use strict";

/**
 * Attach the deploy to the gulp task `deploy.cms.workingcopy`.
 *
 * @param {Gulp} gulp
 * @param {Object} opts
 * @param {string} opts.buildDir
 */
const attachToGulp = (gulp, opts) =>{

	const Deploy = new (require('./deploy'))({
		to: opts.buildDir,
		gulp: gulp
	});

	gulp.task('deploy.cms.workingcopy', () =>{
		return Deploy.workingCopy()
			.then(() => { Deploy.startWatchers(); });
	});
};

module.exports = attachToGulp;