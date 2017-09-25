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

	/*
	 TODO: Find a better name for this. Which kind of products are these?
	 Maybe just deploy.portal?
	 */
	gulp.task('deploy.cms.workingcopy', () =>{

		const Deploy = new (require('./deploy'))({
			to: opts.buildDir,
			gulp: gulp
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
			.then(() =>{
				return Deploy.startWatchers();
			})
	});

	gulp.task('deploy.servicelayer', () =>{

		const Deploy = new (require('./deploy'))({
			to: opts.buildDir,
			gulp: gulp
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