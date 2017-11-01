#! /usr/bin/env node

'use strict';

const rimraf = require('rimraf');
const path = require('path');
const log = require('@studyportals/node-log');
const lockfile = path.join(process.cwd(), 'package-lock.json');

log.debug(`Removing ${lockfile}.`);

return rimraf.sync(lockfile);