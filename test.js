const rimraf = require('./lib/rimraf');
const path = require('path');

let dir = `${path.resolve(__dirname)}/testcases/prepare`;
return rimraf(dir);
