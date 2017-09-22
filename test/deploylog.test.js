"use strict";

const request = require('request');

process.env.PRTL_DEPLOYLOG_ENDPOINT = 'https://ebq58mmn8e.execute-api.eu-central-1.amazonaws.com/dev/create';

try{

    request.post(process.env.PRTL_DEPLOYLOG_ENDPOINT, {
            json: {
                input: process.argv.slice(2).join(','),
                platform: process.platform,
                arch: process.arch,
                uid: process.env.USERNAME || process.env.USER,
            }
        }
    )
    .on('error', function(err) {

        // Nothing to do
    });
}
catch(exc){

    // Nothing to do
}