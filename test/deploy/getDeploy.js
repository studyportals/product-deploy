"use strict";

const PD = require('../../index');
const path = require('path');

const Deploy = new PD.Deploy({
	from: path.resolve(__dirname, '..', '..', 'testcases', 'deploy'),
	gulp: require('gulp')
});

module.exports = Deploy;