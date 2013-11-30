/**
 * Module dependencies.
 */
var scripts = require('scripts')
  , path = require('path')
  , fs = require('fs')
  , existsSync = fs.existsSync || path.existsSync // <=0.6
  

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
 *   app.phase(locomotive.boot.routes('config/routes.js', app));
 *
 * @param {String|Object} options
 * @param {Application} appArg
 * @return {Function}
 * @api public
 */
module.exports = function(options, appArg) {
  if ('string' == typeof options) {
    options = { filename: options }
  }
  if (options.constructor.name != 'Object') {
    appArg = options;
    options = undefined;
  }
  options = options || {};
  var filename = options.filename || 'config/routes'
    , extensions = options.extensions;
  
  return function routes() {
    var script = scripts.resolve(path.resolve(filename), extensions);
    
    if (!existsSync(script)) { return done(); }
    appArg.__router.draw(require(script));
  }
}
