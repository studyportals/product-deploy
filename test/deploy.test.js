"use strict";

describe('Deploy', function(){

	require('./deploy/composer')();
	require('./deploy/revision')();
	require('./deploy/sass')();
	require('./deploy/js')();
	require('./deploy/configure')();
});