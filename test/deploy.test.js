"use strict";

describe('Deploy', function(){

	require('./deploy/prepare')();
	require('./deploy/composer')();
	require('./deploy/assemble')();
	require('./deploy/revision')();
	require('./deploy/sass')();
	require('./deploy/js')();
	require('./deploy/configure')();
});