/**
 * Module dependencies.
 */
var scripts = require('scripts')
  , path = require('path')
  , fs = require('fs')
  , existsSync = fs.existsSync || path.existsSync; // node <=0.6
  

/**
 * Route drawing phase.
 *
 * This phase will `require` a routes file, allowing the application to draw its
 * routes.
 *
 * This phase is typically the last phase before instructing the server to
 * listen.  Any initializers should be run prior to drawing routes, ensuring
 * that the application is fully prepared to handle requests.
 *
 * Examples:
 *
 *   app.phase(locomotive.boot.routes('config/routes.js'));
 *
 * @param {String|Object} options
 * @return {Function}
 * @api public
 */
module.exports = function(options) {
  if ('string' == typeof options) {
    options = { filename: options };
  }
  options = options || {};
  var filename = options.filename || 'config/routes'
    , extensions = options.extensions;
  
  return function routes() {
    var script = scripts.resolve(path.resolve(filename), extensions);
    
    if (!existsSync(script)) { return; }
    this.__router.draw(require(script));
  };
};
