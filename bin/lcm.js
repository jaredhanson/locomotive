#!/usr/bin/env node

var program = require('commander')
  , locomotive = require('../');

program.version(locomotive.version)
  .option('-A, --app [directory]', 'load app at specified directory (default: `pwd`)');

program.command('create')
  .description('-> create Locomotive application')
  .action(function() {
    locomotive.cli.create(program.args.shift() || '.');
  });

program.command('server')
  .description('-> start the Locomotive server')
  .option('-a, --address [address]', 'listen on specified address (default: 0.0.0.0)')
  .option('-p, --port [port]', 'listen on specified port (default: 3000)', parseInt)
  .option('-e, --env [environment]', 'run in specified environment (default: development)')
  .option('--debug [port]', 'enable V8 debugger on specified port (default: 5858)', parseInt)
  .option('--debug-brk [port]', 'enable V8 debugger on specified port and break immediately (default: 5858)', parseInt)
  .action(function(options) {
    options = options || {};
    options.address = options.address || '0.0.0.0';
    options.port = options.port || 3000;
    options.env = options.env || process.env.NODE_ENV || 'development';
    
    // TODO: Implement daemon and cluster mode
    
    locomotive.cli.server(program.app || process.cwd(), options.address, options.port, options.env, options);
  }).on('--help', function(options) {
    if (program.rawArgs.indexOf('--more') != -1) {
      console.log('  Debugging:');
      console.log();
      console.log('    $ lcm server --debug');
      console.log();
    }
  });

/*
program.command('generate <GENERATOR>')
  .description("-> generate new code")
  .option('-f, --force', "overwrite files that already exist")
  .action(function(generator, options) {
    console.log('generate "%s" using %s mode', generator, options.force);
  });
*/

program.parse(process.argv);
