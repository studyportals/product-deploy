"use strict";

/**
 * Attach the deploy tasks to gulp
 *
 * Tasks:
 * - deploy.cms.workingcopy
 * - deploy.servicelayer
 * - deploy.servicelayer.codebuild
 *
 * @param {Gulp} gulp
 */
const attachToGulp = (gulp) =>{

	const Deploy = new (require('./deploy'))({
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