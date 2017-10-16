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
 * - process.env.PRTL_ENV - Set the portal environment; @see lib/private/env
 * - process.env.PRTL_DEPLOYLOG_ENDPOINT - The endpoint to which to send deploylogs.
 *
 * @param {Gulp} gulp
 */
const attachToGulp = (gulp) =>{

	const Deploy = new (require('./private/deploy'))({
		gulp: gulp
	});

	gulp.task('watch.cms', () =>{

		gulp.on('stop', function(){

			Deploy.startWatchers();
		});
	});

	gulp.task('deploy.cms', () =>{

		require('./private/deploylog').attachToGulp(gulp);

		return Promise.all([
			Deploy.clearDist(),
			Deploy.clearCache({
				cache_location: 'Core/Data/Cache/'
			}),
			Deploy.clearErrorLog({
				error_location: 'Core/Data/ErrorLog/'
			}),
			Deploy.configure(),
			Deploy.writeRevisionJson(),
		])
			.then(function(){
				return Deploy.composer();
			})
			.then(function(){
				return Deploy.js();
			})
			.then(function(){
				return Deploy.sass();
			})
	});

	gulp.task('deploy.servicelayer', () =>{

		require('./private/deploylog').attachToGulp(gulp);

		return Promise.all([
			Deploy.clearCache({
				cache_location: 'Data/Cache/'
			}),
			Deploy.clearErrorLog({
				error_location: 'Data/ErrorLog/'
			}),
			Deploy.configure(),
			Deploy.writeRevisionJson(),
		])
			.then(function(){
				return Deploy.composer();
			})
	});
};

module.exports = attachToGulp;