/*global process*/

"use strict";

/**
 * Attach the deploy tasks to gulp
 *
 * Tasks:
 * - watch.cms
 * - deploy.cms
 * - deploy.servicelayer
 *
 * Behaviour can be changed by changing these env vars:
 * - process.env.PRTL_ENV - Set the portal environment; @see [./lib/private/env](https://github.com/studyportals/product-deploy/blob/master/lib/private/env.js)
 * - process.env.PRTL_DEPLOYLOG_ENDPOINT - The endpoint to which to send deploylogs.
 *
 * @param {Gulp} gulp
 */
const attachToGulp = (gulp) =>{

	const DeployCMS = new (require('./private/deploy'))({
		gulp: gulp,
		cache_location: 'Core/Data/Cache/',
		error_location: 'Core/Data/ErrorLog/'
	});

	gulp.task('watch.cms', () =>{

		DeployCMS.startWatchers();
	});

	gulp.task('deploy.cms', () =>{

		require('./private/deploylog').attachToGulp(gulp);

		return Promise.all([
			DeployCMS.clearDist(),
			DeployCMS.clearCache(),
			DeployCMS.clearErrorLog(),
			DeployCMS.configure(),
			DeployCMS.writeRevisionJson(),
		])
			.then(function(){
				return DeployCMS.composer();
			})
			.then(function(){
				return DeployCMS.js();
			})
			.then(function(){
				return DeployCMS.sass();
			})
	});

	const DeploySL = new (require('./private/deploy'))({
		gulp: gulp,
		cache_location: 'Data/Cache/',
		error_location: 'Data/ErrorLog/'
	});

	gulp.task('watch.servicelayer', () =>{

		DeploySL.startWatchers({
			scss: false,
			js: false
		});
	});

	gulp.task('deploy.servicelayer', () =>{

		require('./private/deploylog').attachToGulp(gulp);

		return Promise.all([
			DeploySL.clearCache(),
			DeploySL.clearErrorLog(),
			DeploySL.configure(),
			DeploySL.writeRevisionJson(),
		])
			.then(function(){
				return DeploySL.composer();
			})
	});
};

module.exports = attachToGulp;