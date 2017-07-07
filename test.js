const prepare = require('./lib/prepare');
const path = require('path');

let dir = `${path.resolve(__dirname)}/testcases/prepare`;
return prepare.emptyDir(dir)
	.then(function() {

		console.log('done');
	});