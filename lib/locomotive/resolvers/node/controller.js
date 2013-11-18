/**
 * Module dependencies.
 */
var scripts = require('scripts')
  , path = require('path')
  , fs = require('fs')
  , existsSync = fs.existsSync || path.existsSync // node <=0.6
  , underscore = require('../../utils').underscore;


module.exports = function(options) {
  if ('string' == typeof options) {
    options = { dirname: options }
  }
  options = options || {};
  var dirname = options.dirname || 'app/controllers'
    , extensions = options.extensions
    , dir = path.resolve(dirname);
  
  return function(id) {
    var longId = id + 'Controller'
      , cands = [ id, longId,
                  id.toLowerCase(), longId.toLowerCase(),
                  underscore(id), underscore(longId) ]
      , aid, script;
    
    // TODO: Filter the candidates to a unique set of elements, to optimize
    //       away redundant file exists checks.
    
    for (var i = 0, len = cands.length; i < len; ++i) {
      aid = path.join(dir, cands[i])
      script = scripts.resolve(aid, extensions);
      if (existsSync(script)) { return script; }
    }
  }
}
