var url = require('url')
  , router = require('actionrouter');

exports.path = function(pattern) {
  // from underlay/express.js#L49
  var keys = []
    , placeholders = [];
  router.util.pathRegexp(pattern, keys);
  keys.forEach(function(key) {
    if (!key.optional) { placeholders.push(key.name); }
  });
  
  return function(a) {
    if (arguments.length !== placeholders.length) { throw new Error('Incorrect number of arguments passed to route helper for ' + pattern); }
  
    // from helpers/route/entry.js#L17
    var options = {};
    for (var i = 0, len = arguments.length; i < len; i++) {
      var arg = arguments[i];
      var placeholder = placeholders[i];
    
      if (arg && (arg.id || arg.id === 0)) {
        options[placeholder] = arg.id;
      } else if (arg || arg === 0) {
        options[placeholder] = arg;
      }
    }
  
    // from actionrouter:lib/entry.js#L48
    var path = pattern;
    keys.forEach(function(key) {
      if (!key.optional) {
        if (!options[key.name] && options[key.name] !== 0) { throw new Error('Unable to substitute value for ":' + key.name + '" in URL pattern "' + pattern + '"'); }
        path = path.replace(':' + key.name, options[key.name]);
      } else {
        var replacement = options[key.name] ? '$1' + options[key.name] : '';
        path = path.replace(new RegExp('(\\.?\\/?):' + key.name + '\\?'), replacement);
      }
    });
    
    return url.format({ pathname: path });
  };
};

exports.url = function(pattern, name) {
  
  return function(req, res) {
    return function(a) {
      var options = {};
      options.pathname = this[name + 'Path'].apply(this, arguments);
      if (req.headers && req.headers.host) {
        options.protocol = req.protocol || 'http';
        options.host = req.headers.host;
      }
      
      return url.format(options);
    };
  };
};
