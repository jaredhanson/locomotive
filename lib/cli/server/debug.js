/**
 * server/debug.js
 *
 * This is a shim script used by Locomotive when respawning in debug mode.
 *
 * If this message is being read from within a debugger, the script was launched
 * in `--debug-brk` mode, and execution was forced to break at the first line of
 * the main script while waiting for the debugger to connect.  Debugging can now
 * continue by running with breakpoints enabled and stepping through code.
 */

// process.argv[0] -> node
// process.argv[1] -> script.js
var app = process.argv[2] || process.cwd()
  , address = process.argv[3] || '0.0.0.0'
  , port = process.argv[4] || 3000
  , env = process.argv[5] || 'development';

require('../server')(app, address, port, env);
