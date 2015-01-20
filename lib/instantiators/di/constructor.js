var debug = require('debug')('locomotive:di');


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
    if (name[0] != name[0].toUpperCase()) { return; }
    
    var deps = mod['@require'] || []
      , args = [];
      
    for (var i = 0, len = deps.length; i < len; ++i) {
      debug('create %s', deps[i]);
      var inst = container.create(deps[i], this);
      args.push(inst);
    }
    
    switch (args.length) {
      case  0: return new mod();
      case  1: return new mod(args[0]);
      case  2: return new mod(args[0], args[1]);
      case  3: return new mod(args[0], args[1], args[2]);
      case  4: return new mod(args[0], args[1], args[2], args[3]);
      case  5: return new mod(args[0], args[1], args[2], args[3], args[4]);
      case  6: return new mod(args[0], args[1], args[2], args[3], args[4], args[5]);
      case  7: return new mod(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
      case  8: return new mod(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
      case  9: return new mod(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
      case 10: return new mod(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);
    }
    throw new Error("Constructor for component '" + this.id + "' requires too many arguments");
  };
};
