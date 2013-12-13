/**
 * Module dependencies.
 */
var locomotive = require('..')
  , bootable = require('bootable')
  , path = require('path')
  , spawn = require('child_process').spawn
  , debug = require('debug')('locomotive');


/**
 * Start server.
 *
 * @param {String} dir
 * @param {String} address
 * @param {Number} port
 * @param {String} env
 * @param {String} options
 * @api private
 */
exports = module.exports = function server(dir, address, port, env, options) {
  console.log('CLI ENV: ' + env);
  options = options || {};
  
  var command, args, proc;
  
  // TODO: Check if directory exists.
  //if (!existsSync(dir)) { return callback(new Error('Application does not exist: ' + dir)); }
  
  // If debug mode is enabled, Locomotive will respawn using a node process with
  // V8 debugging support enabled.
  var dbg = options.debug || options.debugBrk;
  if (dbg) {
    var dbgMode = options.debug ? 'debug' : 'debug-brk';
    var dbgPort = options.debug ? options.debug : options.debugBrk;
    dbgPort = (typeof dbgPort == 'boolean') ? 5858 : dbgPort;
    
    command = process.argv[0];
    args = [ '--' + dbgMode + '=' + dbgPort,
             path.join(__dirname, 'server/debug.js'),
             dir, address, port, env ];
    
    debug('respawning in debug mode (%s %s)', command, args.join(' '));
    
    proc = spawn(command, args);
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
    return;
  }
  
  if (options.watch) {
    if (options.useNodemon) {
      command = 'nodemon';
      args = [ '-w', dir,
               path.join(__dirname, 'server/watch.js'),
               dir, address, port, env ];

      debug('respawning in watch mode (%s %s)', command, args.join(' '));

      proc = spawn(command, args);
      proc.stdout.pipe(process.stdout);
      proc.stderr.pipe(process.stderr);
      proc.on('exit', function(code, signal) {
        if (code == 127) {
          console.log();
          console.log('nodemon is not currently installed on this system.  To install, execute:');
          console.log('    $ npm install nodemon -g');
          console.log();
        }
      });
      return;
    }
    
    // supervisor@0.3.0
    command = 'supervisor';
    args = [ '-w', dir, '--no-restart-on', 'error',
             '--', path.join(__dirname, 'server/watch.js'),
             dir, address, port, env ];
                 
    debug('respawning in watch mode (%s %s)', command, args.join(' '));
    
    proc = spawn(command, args);
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
    proc.on('exit', function(code, signal) {
      if (code == 127) {
        console.log();
        console.log('supervisor is not currently installed on this system.  To install, execute:');
        console.log('    $ npm install supervisor -g');
        console.log();
      }
    });
    return;
  }
  
  
  console.log('Locomotive %s application starting in %s on http://%s:%d', locomotive.version
                                                                        , env, address, port);
  
  debug('booting app at %s in %s environment', dir, env);
  
  var app = locomotive;
  app.phase(locomotive.boot.controllers(path.resolve(dir, './app/controllers')));
  app.phase(locomotive.boot.views());
  app.phase(require('bootable-environment')({ dirname: path.resolve(dir, './config/environments'), env: env }));
  app.phase(bootable.initializers(path.resolve(dir, './config/initializers')));
  app.phase(require('../boot/datastores')());
  app.phase(locomotive.boot.routes(path.resolve(dir, './config/routes')));
  app.phase(locomotive.boot.httpServer(port, address));
  
  app.boot(env, function(err) {
    if (err) {
      console.error(err.message);
      console.error(err.stack);
      return process.exit(-1);
    }
  });
};
