/**
 * Module dependencies.
 */
var scripts = require('scripts')
  , path = require('path')
  , fs = require('fs')
  , existsSync = fs.existsSync || path.existsSync // node <=0.6
  , debug = require('debug')('maglev:di');


module.exports = function(options, container) {
  if (!container) {
    try {
      container = require('electrolyte');
    } catch (_) {
      // workaround when `npm link`'ed for development
      var prequire = require('parent-require');
      container = prequire('electrolyte');
    }
  }
  
  if ('string' == typeof options) {
    options = { filename: options };
  }
  options = options || {};
  var filename = options.filename || 'config/routes'
    , extensions = options.extensions;
  
  return function routes() {
    var script = scripts.resolve(path.resolve(filename), extensions);
    if (!existsSync(script)) { return; }
    
    var mod = require(script);
    var deps = mod['@require'] || []
      , args = [];
    
    for (var i = 0, len = deps.length; i < len; ++i) {
      debug('create %s', deps[i]);
      var inst = container.create(deps[i], this);
      args.push(inst);
    }
    
    mod.apply(this.__router, args);
  };
};
