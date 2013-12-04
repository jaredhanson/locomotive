/**
 * Listen for HTTP requests using a cluster of HTTP servers.
 *
 * This phase creates a cluster of HTTP servers and listens for requests on the
 * given address and port, defaulting to 0.0.0.0:3000.
 *
 * This phase is typically one of the final phases in the boot sequence.
 * Initializers should be run and routes should be drawn prior to this phase,
 * ensuring that the application is fully prepared to handle requests.
 *
 * Examples:
 *
 *   app.phase(locomotive.boot.httpServerCluster(8080));
 *
 *   app.phase(locomotive.boot.httpServerCluster(8080, '127.0.0.1'));
 *
 *   app.phase(locomotive.boot.httpServerCluster(8080, '127.0.0.1', { size: 8 }));
 *
 * @param {Number} port
 * @param {String} address
 * @param {Object} options
 * @return {Function}
 * @api public
 */
module.exports = function(port, address, options) {
  var os = require('os')
    , http = require('http')
    , cluster = require('cluster')
    , debug = require('debug')('locomotive');
  
  if (typeof address == 'object') {
    options = address;
    address = undefined;
  } else if (typeof port == 'object') {
    options = port;
    address = undefined;
    port = undefined;
  }
  options = options || {};
  port = port || options.port || 3000;
  address = address || options.address || '0.0.0.0';
  
  var size = options.size || os.cpus().length;
  
  return function httpServerCluster(done) {
    if (cluster.isMaster) {
      console.info('Creating HTTP server cluster with %d workers', size);
      
      for (var i = 0; i < size; ++i) {
        debug('spawning worker process %d', (i + 1));
        cluster.fork();
      }
      
      cluster.on('fork', function(worker) {
        debug('worker %s spawned', worker.id);
      });
      cluster.on('online', function(worker) {
        debug('worker %s online', worker.id);
      });
      cluster.on('listening', function(worker, addr) {
        debug('worker %s listening on %s:%d', worker.id, addr.address, addr.port);
      });
      cluster.on('disconnect', function(worker) {
        debug('worker %s disconnected', worker.id);
      });
      cluster.on('exit', function(worker, code, signal) {
        debug('worker %s died (%s)', worker.id, signal || code);
        if (!worker.suicide) {
          debug('restarting worker');
          cluster.fork();
        }
      });
    } else {
      http.createServer(this.express).listen(port, address, function() {
        var addr = this.address();
        console.info('HTTP server listening on %s:%d', addr.address, addr.port);
        return done();
      });
    }
  };
};
