"use strict";

/**
 * @module log
 */

const gutil = require('gulp-util');

const DEFAULT_VERBOSITY = 2;

let verbosity = DEFAULT_VERBOSITY;

/**
 * Set the verbosity level
 * - 0: No output
 * - 1: Error output
 * - 2: Warning output
 * - 3: Info output
 * - 4: Debug output
 *
 * Default verbosity level can be overridden by setting the env var `VERBOSITY`
 * @param {number} x - Verbosity level
 * @alias module:log
 * @return void
 */
const setVerbosity = function(x){
	verbosity = x;
};
setVerbosity(process.env['VERBOSITY'] || DEFAULT_VERBOSITY);

/**
 * Debug message (gray)
 * @param {string} message
 * @alias module:log
 * @return void
 */
const debug = function(message){
	if(verbosity > 3){
		output(gutil.colors.gray(message));
	}
};

/**
 * Info message (white)
 * @param {string} message
 * @alias module:log
 * @return void
 */
const info = function(message){
	if(verbosity > 2){
		output(gutil.colors.white(message));
	}
};

/**
 * Warning message (yellow)
 * @param {string} message
 * @alias module:log
 * @return void
 */
const warning = function(message){
	if(verbosity > 1){
		output(gutil.colors.yellow(message));
	}
};

/**
 * Error message (red)
 * @param {string} message
 * @return void
 */
const error = function(message){
	if(verbosity > 0){
		output(gutil.colors.red(message));
	}
};

/**
 * Message
 * @param {string} message
 * @return void
 * @private
 */
const output = function(message){
	gutil.log(message);
};

module.exports = {
	setVerbosity,
	debug,
	info,
	warning,
	error
};