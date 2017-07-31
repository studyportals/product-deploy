"use strict";

/**
 * @module lib/siteDB
 */

const fs = require("fs-extra");
const path = require('path');
const gulp = require('gulp');
const concat = require('gulp-concat');
const sqlite3 = require('sqlite3');
const log = require('@studyportals/node-log');

/**
 * Compile the siteDB.
 *
 * It will execute the sql statements in these files:
 * - `${opts.buildDir}/vendor/studyportals/cms/Core/InitTables.sqlite`
 * - `${opts.buildDir}/Packages/${opts.product}/Core/Site.sqlite`
 *
 * @param {Object} opts
 * @param {String} opts.buildDir
 * @param {String} opts.product
 * @static
 * @return {Promise}
 */
const compile = (opts) => {

	return new Promise((resolve, reject) => {

		const initTable = path.resolve(opts.buildDir, 'vendor', 'studyportals', 'cms', 'Core', 'InitTables.sqlite');

		const packageCore = path.resolve(opts.buildDir, 'Packages', opts.product, 'Core');
		const sqlitePath = path.resolve(packageCore, 'Site.sqlite');
		const siteDbPath = path.resolve(packageCore, 'Site.db');

		if(!fs.existsSync(initTable) || !fs.existsSync(sqlitePath)){

			return resolve();
		}

		gulp.src([initTable, sqlitePath])
			.pipe(concat('Combined.sqlite'))
			.pipe(gulp.dest(packageCore))
			.on('end', function(){

				let sql = fs.readFileSync(path.resolve(packageCore, 'Combined.sqlite'), 'utf8');
				const db = new sqlite3.Database(siteDbPath);

				db.exec(sql, err =>{

					if(err){

						reject(err);
						return;
					}

					db.close();

					_validate(siteDbPath)
						.then(function(){

							log.info(`SiteDB: '${siteDbPath}' generated successfully.`);
							resolve();
						})
						.catch(reject);
				});
			});
	});
};


/**
 * @param {String} dbPath
 * @return {Promise}
 * @private
 */
const _validate = (dbPath) =>{

	return new Promise((resolve, reject) => {

		const sanityChecks = {
			'SELECT COUNT(1) AS check_result FROM cms_sites;': ' > 0',
			'SELECT COUNT(1) AS check_result FROM cms_languages;': ' == 4',
			'SELECT COUNT(1) AS check_result FROM cms_pages;': ' > 1',
			'SELECT COUNT(1) AS check_result FROM cms_pages_languages;': ' > 1',
			'SELECT COUNT(1) AS check_result FROM cms_modules;': ' > 1'
		};
		const sanityCheckQueries = Object.keys(sanityChecks);
		let passed = 0;
		let index = 0;
		const db = new sqlite3.Database(dbPath);

		const sanityCheck = () =>{

			let sql = sanityCheckQueries[index];

			db.get(sql, (error, result) =>{

				if(error){

					throw error;
				}

				const passedBoolean = eval(result['check_result'] + sanityChecks[sql]);

				if(passedBoolean === false){

					log.warn(`SiteDB: Sanity check ${sql}' -> ' ${sanityChecks[sql]} ' FAILED.`);
				}
				passed += passedBoolean;
				index += 1;

				if(passed == sanityCheckQueries.length){

					db.close();
					resolve(`Validated ${dbPath} successfully.`);
				}
				else if(index == sanityCheckQueries.length){

					db.close();
					reject(`Validate ${dbPath} failed.`);
				}
				else{

					sanityCheck();
				}
			});
		};

		sanityCheck();
	});
};

module.exports = {
	compile
};