/**
 * Module dependencies.
 */
var locomotive = require('..')
  , path = require('path')
  , spawn = require("child_process").spawn
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
  options = options || {};
  
  // If debug mode is enabled, Locomotive will respawn using a node process with
  // V8 debugging support enabled.
  var dbg = options.debug || options.debugBrk;
  if (dbg) {
    var dbgMode = options.debug ? 'debug' : 'debug-brk';
    var dbgPort = options.debug ? options.debug : options.debugBrk;
    dbgPort = (typeof dbgPort == 'boolean') ? 5858 : dbgPort;
    
    var command = process.argv[0];
    var args = [ '--' + dbgMode + '=' + dbgPort,
                 path.join(__dirname, 'server/debug.js'),
                 dir, address, port, env ];
    
    debug('respawning in debug mode (%s %s)', command, args.join(' '));
    
    var proc = spawn(command, args);
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
    return;
  }
  
  if (options.watch) {
    if (options.useNodemon) {
      var command = 'nodemon';
      var args = [ '-w', dir,
                   path.join(__dirname, 'server/watch.js'),
                   dir, address, port, env ];

      debug('respawning in watch mode (%s %s)', command, args.join(' '));

      var proc = spawn(command, args);
      proc.stdout.pipe(process.stdout);
      proc.stderr.pipe(process.stderr);
      proc.on('exit', function(code, signal) {
        if (code == 127) {
          console.log();
          console.log("nodemon is not currently installed on this system.  To install, execute:");
          console.log("    $ npm install nodemon -g");
          console.log();
        }
      });
      return;
    }
    
    // supervisor@0.3.0
    var command = 'supervisor';
    var args = [ '-w', dir, '--no-restart-on', 'error',
                 '--', path.join(__dirname, 'server/watch.js'),
                 dir, address, port, env ];
                 
    debug('respawning in watch mode (%s %s)', command, args.join(' '));
    
    var proc = spawn(command, args);
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
    proc.on('exit', function(code, signal) {
      if (code == 127) {
        console.log();
        console.log("supervisor is not currently installed on this system.  To install, execute:");
        console.log("    $ npm install supervisor -g");
        console.log();
      }
    });
    return;
  }
  
  
  console.log('Locomotive %s application starting in %s on http://%s:%d', locomotive.version
                                                                        , env, address, port);
  
  debug('booting app at %s in %s environment', dir, env);
  locomotive.boot(dir, env, function(err, server) {
    if (err) { throw err; }
    server.listen(port, address, function() {
      var addr = this.address();
      debug('listening on %s:%d', addr.address, addr.port);
    });
  });
}
