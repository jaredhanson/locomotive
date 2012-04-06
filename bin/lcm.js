#!/usr/bin/env node

var program = require('commander')
  , locomotive = require('../');

program.version(locomotive.version)
  .option('-a, --app [directory]', 'load app at specified directory (default: <working-dir>)')
  .option('-p, --port [number]', 'listen on specified port (default: 3000)')
  .option('-e, --env [environment]','switch between environments (default: development)')
  .option('--debug', 'enable node debug mode')
  .option('--debug-brk', 'enable node debug-brk mode')
  .option('--debug-port [number]', 'debug app on specified port(default: 5858)');

program.command('create')
  .description('-> create Locomotive application')
  .action(function() {
    locomotive.cli.create(program.args.shift() || '.');
  });

program.command('server')
  .description('-> start the Locomotive server')
  .action(function() {
    var debug = program.debug || program.debugBrk;
    if (debug) {
      var debugMode = program.debug ? "--debug" : "--debug-brk"
        , filePath = require("path").join(__dirname, "server.js")
        , command = ["node ", debugMode, " ", filePath].join("");
      
      require("child_process")
        .exec(command,function(err, stdout, stderr){
          if(err){ throw err; }
          console.log(stdout);
        });
    } else {
      locomotive.cli.server(program.app || process.cwd(), program.port || 3000, program.env || process.env.NODE_ENV || 'development');
    }
  });

program.parse(process.argv);
