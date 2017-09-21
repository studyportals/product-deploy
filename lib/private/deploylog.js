"use strict";

const request = require('request');
const log = require('@studyportals/node-log');
const startTime = new Date();

const logState = (state, time, success, extra) => {

    log.debug(`logState: ${state}. ${time}, ${success}, ${extra}`);

    if(!success){

        const issue_url = 'https://github.com/studyportals/product-deploy/issues/new';
        log.error(`Fatal error, please consider writing a bug report: ${issue_url}`);
    }

    extra = extra || '';
    extra = extra.replace(/'/g, 'QUOTE');

    const pjson = require('../../package.json');
    const input = process.argv.slice(2).join(',');
    const cwd = process.cwd();
    const project = cwd.replace(/\\/g, "/").split('/').slice(-1);
    const platform = process.platform;
    const arch = process.arch;
    const uid = process.env.USERNAME || process.env.USER;
    const jenkins = cwd.indexOf('/StudyPortals') === 0;
    const version = pjson.version;
    const date = (startTime).toISOString().substring(0, 19).replace('T', ' ');

    try {
        request.post(process.env.PRTL_DEPLOYLOG_ENDPOINT, {
                json: {
                    state,
                    input,
                    success,
                    time,
                    packages: '',
                    platform,
                    arch,
                    extra,
                    project,
                    uid,
                    jenkins,
                    date,
                    version
                }
            }
        );
    }
    catch (ex) {

    }
};

module.exports.attachToGulp = (gulp) => {

    if (!(typeof(gulp) === "object" && gulp.constructor && gulp.constructor.name === "Gulp")) {

        throw new Error("Cannot register package validation to the specified " + gulp);
    }

    if (process.env.PRTL_DISABLE_GULP_LOG) {

        log.debug("env variable PRTL_DISABLE_GULP_LOG is set, no build info will be supplied");
        return;
    }
    else if (!process.env.PRTL_DEPLOYLOG_ENDPOINT) {

        log.debug("env variable PRTL_DEPLOYLOG_ENDPOINT is not set, no build info will be supplied");
        return;
    }
    else {

        log.debug("env variable PRTL_DISABLE_GULP_LOG is not set, build information will be sent for analysis");
    }

    gulp.on('stop', () => {

        logState('finish', (new Date() - startTime) / 1000.0, true);
    });

    gulp.on('err', data => {

        logState('err', (new Date() - startTime) / 1000.0, false, data.message + " : " + data.err.stack);
    });

    process.on('uncaughtException', err => {

        logState('err', (new Date() - startTime) / 1000.0, false, gulp.seq[0] + " : " + err.stack);
    });
    process.on('unhandledRejection', err => {

        logState('err', (new Date() - startTime) / 1000.0, false, gulp.seq[0] + " : " + err.stack);
    });
};