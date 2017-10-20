"use strict";

it(`It should report github status`, function(){

    process.env.PRTL_VERBOSITY = 4;

    const repoStatus = require('../lib/private/github-repo-status');

    return repoStatus('Product-Deploy', 0, 4);
});