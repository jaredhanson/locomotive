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
exports = module.exports = function server(port) {
  console.log('Starting Locomotive ' + locomotive.version + ' application...');
  
  var server = locomotive.init();
  server.listen(3000);
  
  var addr = server.address();
  console.log('HTTP server listening on: ' + 'http://' + addr.address + ':' + addr.port);
}
