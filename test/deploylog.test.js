"use strict";

const request = require('request');

process.env.PRTL_DEPLOYLOG_ENDPOINT = 'https://fzsm37215j.execute-api.eu-central-1.amazonaws.com/prod/create';

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
    .on('error', function(){

        // Nothing to do
    });
}
catch(exc){

    // Nothing to do
}