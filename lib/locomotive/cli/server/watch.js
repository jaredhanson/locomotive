/**
 * server/watch.js
 *
 * This is a shim script used by Locomotive when respawning in watch mode.
 */

// process.argv[0] -> nodemon
// process.argv[1] -> script.js
var app = process.argv[2] || process.cwd()
  , address = process.argv[3] || '0.0.0.0'
  , port = process.argv[4] || 3000
  , env = process.argv[5] || 'development'

require('../server')(app, address, port, env);
