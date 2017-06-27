"use strict";

/**
 * @module log
 */

const gutil = require('gulp-util');

const DEFAULT_VERBOSITY = 2;

let verbosity = DEFAULT_VERBOSITY;

/**
 * Verbosity levels:
 * - 0: No output
 * - 1: Error output
 * - 2: Warning output
 * - 3: Info output
 * - 4: Debug output
 *
 * Default verbosity level can be overridden by setting the env var `VERBOSITY`
 * @param {integer} x - Verbosity level
 * @return void
 */
const setVerbosity = function(x){
	verbosity = x;
};
setVerbosity(process.env['VERBOSITY'] || DEFAULT_VERBOSITY);

/**
 * Debug message (gray)
 * @param {string} s
 * @return void
 */
const debug = function(s){
	if(verbosity > 3){
		output(gutil.colors.gray(s));
	}
};

/**
 * Info message (white)
 * @param {string} s
 * @return void
 */
const info = function(s){
	if(verbosity > 2){
		output(gutil.colors.white(s));
	}
};

/**
 * Warning message (yellow)
 * @param {string} s
 * @return void
 */
const warning = function(s){
	if(verbosity > 1){
		output(gutil.colors.yellow(s));
	}
};

/**
 * Error message (red)
 * @param {string} s
 * @return void
 */
const error = function(s){
	if(verbosity > 0){
		output(gutil.colors.red(s));
	}
};

/**
 * Message
 * @param {string} s
 * @return void
 * @private
 */
const output = function(s){
	gutil.log(s);
};

module.exports = {
	setVerbosity,
	debug,
	info,
	warning,
	error
};