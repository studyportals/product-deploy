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
 * @param {Object} opts
 * @param {string} opts.buildDir
 */
const attachToGulp = (gulp, opts) =>{

	// TODO: make it more generic: deploy.cms
	gulp.task('deploy.cms.inline', () =>{

		const Deploy = new (require('./deploy'))({
			to: process.cwd(),
			gulp: gulp
		});

		gulp.on('stop', function(){

			process.env.PRTL_DISABLE_FILEWATCHER = 'true';
			Deploy.startWatchers();
		});

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

	/**
	 * @deprecated remove in next Major release.
	 */
	gulp.task('deploy.cms.workingcopy', () =>{

		const Deploy = new (require('./deploy'))({
			to: opts.buildDir,
			gulp: gulp
		});

		gulp.on('stop', function(){

			Deploy.startWatchers();
		});

		return Deploy.prepare()
			.then(() =>{
				return Deploy.composer();
			})
			.then(() =>{
				return Deploy.assemble();
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

	/**
	 * @deprecated remove in next release
	 */
	gulp.task('deploy.servicelayer', () =>{

		const Deploy = new (require('./deploy'))({
			to: opts.buildDir,
			gulp: gulp
		});

		gulp.on('stop', function(){

			process.env.PRTL_DISABLED_WATCHERS = process.env.PRTL_DISABLED_WATCHERS || 'js,scss';
			Deploy.startWatchers();
		});

		return Deploy.prepare()
			.then(() =>{
				return Deploy.composer();
			})
			.then(() =>{
				return Deploy.assemble();
			})
			.then(() =>{
				return Deploy.writeRevisionJson();
			})
			.then(() =>{
				return Deploy.configure();
			})
	});

	// TODO: make it more generic: deploy.servicelayer
	gulp.task('deploy.servicelayer.codebuild', () =>{

		const Deploy = new (require('./deploy'))({
			to: process.cwd(),
			gulp: gulp
		});

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