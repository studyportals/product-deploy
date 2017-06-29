"use strict";

const log = require('./../lib/log');

it('It should show 4 messages without throwing an exception.', () =>{

	log.setVerbosity(log.VERBOSITY.ALL);

	log.debug('Debug message');
	log.info('Info message');
	log.warning('Warning message');
	log.error('Error message');
});