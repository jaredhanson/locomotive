/**
 * Module dependencies.
 */
var locomotive = require('..');


/**
 * Start server on the specified `port`.
 *
 * @param {Number} port
 * @api private
 */
exports = module.exports = function server(dir, port, env) {
  console.log('Starting Locomotive ' + locomotive.version + ' application...');
  
  var server = locomotive._init(function(app) {
    app._boot(dir,env);
  });
  server.listen(port);
  
  var addr = server.address();
  console.log('HTTP server listening on: ' + 'http://' + addr.address + ':' + addr.port);
}