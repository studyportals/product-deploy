"use strict";

const log = require('./../lib/log');

it('It should show all log messages', () =>{

	log.setVerbosity(4);

	log.debug('Debug message');
	log.info('Info message');
	log.warning('Warning message');
	log.error('Error message');
});