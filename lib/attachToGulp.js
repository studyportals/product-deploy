/*global process*/
"use strict";

/**
 * Attach the deploy tasks to gulp
 *
 * Tasks:
 * - deploy.cms.workingcopy
 * - deploy.servicelayer
 * - deploy.servicelayer.codebuild
 *
 * Behaviour can be changed by changing these env vars:
 * - process.env.PRTL_ENV - Set the portal environment; @see lib/private/env
 * - process.env.PRTL_DISABLE_WATCHERS - Watchers are disabled when this var truthy
 * - process.env.PRTL_DEPLOYLOG_ENDPOINT - The endpoint to which to send deploylogs.
 *
 * @param {Gulp} gulp
 */
const attachToGulp = (gulp) =>{

	const Deploy = new (require('./private/deploy'))({
		gulp: gulp
	});

	gulp.task('watch.cms', ()=>{

		gulp.on('stop', function(){

			Deploy.startWatchers();
		});
	});

	gulp.task('deploy.cms', () =>{

		require('./private/deploylog').attachToGulp(gulp);

		return require('./private/prepare').ensureEmptyDir(Deploy.distFolder)
			.then(() =>{
				return Deploy.composer();
			})
			.then(() =>{
				return Deploy.writeRevisionJson();
			})
			.then(() =>{
				return Deploy.configure();
			})
			.then(() =>{
				return Deploy.sass();
			})
			.then(() =>{
				return Deploy.js();
			})
	});

	gulp.task('deploy.servicelayer', () =>{

		require('./private/deploylog').attachToGulp(gulp);

		return Deploy.composer()
			.then(() =>{
				return Deploy.writeRevisionJson();
			})
			.then(() =>{
				return Deploy.configure();
			})
	});
};

module.exports = attachToGulp;