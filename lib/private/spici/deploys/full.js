"use strict";

const fsExtra = require('fs-extra');
const fs = require('fs');
const path = require('path');
const localGit = require('./lib/git');

/**
 *
 * @param {SPICI} spici
 * @param {GULP} gulp
 */
module.exports.prepare = (spici, gulp) =>{

	return Promise.resolve()
		.then(() =>{

			return createSafeRepo(spici);
		})
		.then(() =>{

			return queueCleanup(spici, gulp);
		})
		.catch(ex =>{

			throw ex;
		});
};

const createSafeRepo = (spici) =>{

	return new Promise(resolve =>{

		spici.root = path.resolve(spici.root, spici.env, spici.product);
		spici.src = path.resolve(spici.root, spici.product);

		console.log(`Deploying 'full' on '${spici.env}' needs a 'safe' folder`);
		console.log(`Using '${spici.root}' as safe folder`);

		if(fs.existsSync(spici.root)){

			console.log("Old sources exist, removing");
			console.log(`rm -rf ${spici.root}`);
			fsExtra.removeSync(spici.root);
		}

		const targetDir = path.resolve(spici.root, '..');

		localGit.clone(targetDir, `git@github.com:studyportals/${spici.product}`)
		.then(() =>{

			return localGit.getCurrentBranchOf(process.cwd());
		})
		.then((branch) =>{

			return localGit.checkout(spici.root, `-f ${branch}`);
		})
		.then(() =>{

			resolve(spici.root);
		})
		.catch(ex =>{

			throw ex;
		});
	});
};

const queueCleanup = (spici, gulp) =>{

	return new Promise(resolve =>{

		let hasCleaned = false;
		const cleanup = () =>{

			if(hasCleaned){

				return;
			}

			hasCleaned = true;

			// Allow clean up if no variable is set or it if is 'false'
			const cleanupAllowed = !process.env.PRTL_NO_CLEANUP_ON_FULL || (process.env.PRTL_NO_CLEANUP_ON_FULL && process.env.PRTL_NO_CLEANUP_ON_FULL == "false");

			if(!cleanupAllowed){

				console.log(`set PRTL_NO_CLEANUP_ON_FULL=false to enable cleanup of sources`);
				return;
			}

			console.log(`set PRTL_NO_CLEANUP_ON_FULL=true to skip cleanup of sources`);

			console.log("Freeing sources folder");
			console.log('chdir /');
			process.chdir(path.resolve('/'));

			console.log("Cleaning up");
			console.log(`rm -rf ${spici.root}`);
			fsExtra.removeSync(spici.root);
		};

		// Queue a cleanup

		gulp.on('stop', () =>{

			console.log("Deploy Procedure finished");
			cleanup();
		});

		// Even when an exception happens, cleanup will try to pass
		process.on("beforeExit", () =>{

			cleanup();
		});

		resolve();
	});
};
