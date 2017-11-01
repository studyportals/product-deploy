#! /usr/bin/env node

'use strict';

const rimraf = require('rimraf');
const path = require('path');

return rimraf.sync(path.join(process.cwd(), 'package-lock.json'));