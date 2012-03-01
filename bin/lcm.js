#!/usr/bin/env node

var program = require('commander')
  , locomotive = require('../');

program.version(locomotive.version)
  .option('-a, --app [directory]', 'load app at specified directory (default: <working-dir>)')
  .option('-p, --port [number]', 'listen on specified port (default: 3000)')
  .option('-e, --env [environment]','switch between environments (default: development)');

program.command('create')
  .description('-> create Locomotive application')
  .action(function() {
    locomotive.cli.create(program.args.shift() || '.');
  });

program.command('server')
  .description('-> start the Locomotive server')
  .action(function() {
    locomotive.cli.server(program.app || process.cwd(), program.port || 3000, program.env || 'development');
  });

program.parse(process.argv);