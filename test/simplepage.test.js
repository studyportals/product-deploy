"use strict";

const SimplePageTester = require('../lib/simple-page-tester');

const pages = [
	'/',
	'/team/',
];

let url = 'https://www.studyportals.com';

let Tester = new SimplePageTester(null, url);
Tester.run(pages);