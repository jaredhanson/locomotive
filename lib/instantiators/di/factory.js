var debug = require('debug')('maglev:di');


module.exports = function(container) {
  if (!container) {
    try {
      container = require('electrolyte');
    } catch (_) {
      try {
        // workaround when `npm link`'ed for development
        var prequire = require('parent-require');
        container = prequire('electrolyte');
      } catch (_) {}
    }
  }

  return function(mod) {
    if (!container) { return; }
    if (typeof mod != 'function') { return; }
    var name = mod.name || 'anonymous';
    if (name[0] != name[0].toLowerCase()) { return; }
    
    var deps = mod['@require'] || []
      , args = [];
      
    for (var i = 0, len = deps.length; i < len; ++i) {
      debug('create %s', deps[i]);
      var inst = container.create(deps[i], this);
      args.push(inst);
    }
    
    return mod.apply(undefined, args);
  };
};
