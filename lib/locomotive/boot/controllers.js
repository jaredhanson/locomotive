/**
 * Module dependencies.
 */
var path = require('path')
  , fs = require('fs')
  , existsSync = fs.existsSync || path.existsSync // <=0.6
  , diveSync = require('diveSync')
  , debug = require('debug')('locomotive');


/**
 * Controller loading phase.
 *
 * This phase will load all controllers in a directory, registering them for the
 * application so that requests can be routed to the desired controller's
 * action.
 *
 * @param {String|Object} options
 * @param {Locomotive} [self]
 * @return {Function}
 * @api private
 */
module.exports = function(options, self) {
  if ('string' == typeof options) {
    options = { dirname: options }
  }
  options = options || {};
  var dirname = options.dirname || 'app/controllers'
    , extensions = options.extensions || Object.keys(require.extensions).map(function(ext) { return ext; })
    , exts = extensions.map(function(ext) {
        if ('.' != ext[0]) { return ext; }
        return ext.slice(1);
      })
    , regex = new RegExp('\\.(' + exts.join('|') + ')$');
  
  return function controllers(done) {
    var dir = path.resolve(dirname);
    if (!existsSync(dir)) { return done(); }
    
    var ex;
    diveSync(dir, function(err, path) {
      if (ex) { return; }
      if (regex.test(path)) {
        var name = path.slice(dir.length + 1).replace(regex, '');
        debug('registering controller: %s', name)
        try {
          self.controller(name, require(path));
        } catch (e) {
          ex = e;
        }
      }
    });
    done(ex);
  }
}
