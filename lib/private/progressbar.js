"use strict";

const ProgressBar = require('progress');

module.exports = function(total_files){

	return new ProgressBar(`[:bar] :current/:total :percent`, { total: total_files });
};