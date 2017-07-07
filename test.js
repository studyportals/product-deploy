const rimraf = require('./lib/rimraf');
const path = require('path');

let dir = `${path.resolve(__dirname)}/testcases/prepare`;
return rimraf(dir)
	.then(function() {

		console.log('done');
	})
	.then(function() {

		console.log('next');
	})
	.catch(function() {
		process.exit();
	});
//process.exit();