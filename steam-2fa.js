#!/usr/bin/env node

'use strict';

var program = require('commander')
  , pkg = require('./package');

program
  .version(pkg.version)
  .command('enable [options]', 'enable two factor authentication')
  .command('disable [options]', 'disable two factor authentication')
  .parse(process.argv);
