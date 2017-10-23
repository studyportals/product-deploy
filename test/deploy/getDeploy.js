"use strict";

const Deploy = require('../../lib/private/deploy');
const path = require('path');

const TestDeploy = new Deploy({
	cwd: path.resolve(__dirname, '..', '..', 'testcases', 'deploy'),
	gulp: require('gulp')
});

module.exports = TestDeploy;