module.exports = function(options, appArg) {
  var http = require('http');
  
  if (options.constructor.name != 'Object') {
    appArg = options;
    options = undefined;
  }
  options = options || {};
  var port = options.port || 3000
    , address = options.address || '0.0.0.0';
  
  return function httpServer(done) {
    http.createServer(appArg.express).listen(port, address, function() {
      var addr = this.address();
      console.info('HTTP server listening on %s:%d', addr.address, addr.port);
      return done();
    });
  }
}
