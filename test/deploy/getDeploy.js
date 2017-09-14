"use strict";

const PD = require('../../index');
const path = require('path');

const Deploy = new PD.Deploy({
	from: path.resolve(__dirname, '..', '..', 'testcases', 'deploy', 'src'),
	to: path.resolve(__dirname, '..', '..', 'testcases', 'deploy', 'dst'),
	gulp: require('gulp')
});

console.log('getDeploy');

module.exports = Deploy;