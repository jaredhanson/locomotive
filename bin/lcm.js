#!/usr/bin/env node

var program = require('commander')
  , locomotive = require('../');

program.version(locomotive.version)
  .option('-p, --port [number]', 'listen on specified port (default: 3000)');

program.command('server')
  .description('-> start the Locomotive server')
  .action(function() {
    locomotive.cli.server(program.port || 3000);
  });

program.parse(process.argv);
