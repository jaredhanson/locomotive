/**
 * Module dependencies.
 */
var mime = require('express').mime;


/**
 * Forward `functions` from `from` to `to`.
 *
 * The `this` context of forwarded functions remains bound to the `to` object,
 * ensuring that property polution does not occur.
 *
 * @param {Object} from
 * @param {Object} to
 * @param {Array} functions
 * @api private
 */
exports.forward = function(from, to, functions) {
  for (var i = 0, len = functions.length; i < len; i++) {
    var method = functions[i];
    from[method] = to[method].bind(to);
  }
};

/**
 * Underscore the given `str`.
 *
 * Examples:
 *
 *    underscore('FooBar');
 *    // => "foo_bar"
 *  
 *    underscore('SSLError');
 *    // => "ssl_error"
 *
 * @param {String} str
 * @return {String}
 * @api protected
 */
exports.underscore = function(str) {
  str = str.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2');
  str = str.replace(/([a-z\d])([A-Z])/g, '$1_$2');
  str = str.replace(/-/g, '_');
  return str.toLowerCase();
};


/**
 * Extensionize the given `type`, for example "text/html" becomes "html".
 *
 * @param {String} type
 * @return {String}
 * @api protected
 */
exports.extensionizeType = function(type) {
  return type.indexOf('/') != -1 ? mime.extension(type) : type;
};

/**
 * Normalize the given `type`, for example "html" becomes "text/html".
 *
 * @param {String} type
 * @return {String}
 * @api protected
 *
 * CREDIT:
 *   https://github.com/visionmedia/express/blob/3.4.5/lib/utils.js#L81
 */
exports.normalizeType = function(type) {
  return ~type.indexOf('/')
    ? acceptParams(type)
    : { value: mime.lookup(type), params: {} };
};

/**
 * Normalize `types`, for example "html" becomes "text/html".
 *
 * @param {Array} types
 * @return {Array}
 * @api protected
 *
 * CREDIT:
 *   https://github.com/visionmedia/express/blob/3.4.5/lib/utils.js#L95
 */
exports.normalizeTypes = function(types){
  var ret = [];

  for (var i = 0; i < types.length; ++i) {
    ret.push(exports.normalizeType(types[i]));
  }

  return ret;
};

/**
 * Return the acceptable type in `types`, if any.
 *
 * @param {Array} types
 * @param {String} str
 * @return {String}
 * @api private
 *
 * CREDIT:
 *   https://github.com/visionmedia/express/blob/3.4.5/lib/utils.js#L113
 */
exports.acceptsArray = function(types, str) {
  // accept anything when Accept is not present
  if (!str) { return types[0]; }

  // parse
  var accepted = exports.parseAccept(str)
    , normalized = exports.normalizeTypes(types)
    , len = accepted.length;

  for (var i = 0; i < len; ++i) {
    for (var j = 0, jlen = types.length; j < jlen; ++j) {
      if (exports.accept(normalized[j], accepted[i])) {
        return types[j];
      }
    }
  }
};

/**
 * Check if `type(s)` are acceptable based on
 * the given `str`.
 *
 * @param {String|Array} type(s)
 * @param {String} str
 * @return {Boolean|String}
 * @api protected
 *
 * CREDIT:
 *   https://github.com/visionmedia/express/blob/3.4.5/lib/utils.js#L140
 */
exports.accepts = function(type, str) {
  if ('string' == typeof type) { type = type.split(/ *, */); }
  return exports.acceptsArray(type, str);
};

/**
 * Check if `type` array is acceptable for `other`.
 *
 * @param {Array} type
 * @param {Object} other
 * @return {Boolean}
 * @api private
 *
 * CREDIT:
 *   https://github.com/visionmedia/express/blob/3.4.5/lib/utils.js#L155
 */
exports.accept = function(type, other) {
  var t = type.value.split('/');
  return (t[0] == other.type || '*' == other.type)
    && (t[1] == other.subtype || '*' == other.subtype)
    && paramsEqual(type.params, other.params);
};

/**
 * Check if accept params are equal.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Boolean}
 * @api private
 *
 * CREDIT:
 *   https://github.com/visionmedia/express/blob/3.4.5/lib/utils.js#L171
 */
function paramsEqual(a, b){
  return !Object.keys(a).some(function(k) {
    return a[k] != b[k];
  });
}

/**
 * Parse accept `str`, returning
 * an array objects containing
 * `.type` and `.subtype` along
 * with the values provided by
 * `parseParams()`.
 *
 * @param {Type} name
 * @return {Type}
 * @api private
 *
 * CREDIT:
 *   https://github.com/visionmedia/express/blob/3.4.5/lib/utils.js#L186
 */
exports.parseAccept = function(str) {
  return exports
    .parseParams(str)
    .map(function(obj) {
      var parts = obj.value.split('/');
      obj.type = parts[0];
      obj.subtype = parts[1];
      return obj;
    });
};

/**
 * Parse quality `str`, returning an
 * array of objects with `.value`,
 * `.quality` and optional `.params`
 *
 * @param {String} str
 * @return {Array}
 * @api private
 *
 * CREDIT:
 *   https://github.com/visionmedia/express/blob/3.4.5/lib/utils.js#L209
 */
exports.parseParams = function(str) {
  return str
    .split(/ *, */)
    .map(acceptParams)
    .filter(function(obj) {
      return obj.quality;
    })
    .sort(function(a, b) {
      if (a.quality === b.quality) {
        return a.originalIndex - b.originalIndex;
      } else {
        return b.quality - a.quality;
      }
    });
};

/**
 * Parse accept params `str` returning an
 * object with `.value`, `.quality` and `.params`.
 * also includes `.originalIndex` for stable sorting
 *
 * @param {String} str
 * @return {Object}
 * @api private
 *
 * CREDIT:
 *   https://github.com/visionmedia/express/blob/3.4.5/lib/utils.js#L235
 */
function acceptParams(str, index) {
  var parts = str.split(/ *; */);
  var ret = { value: parts[0], quality: 1, params: {}, originalIndex: index };

  for (var i = 1; i < parts.length; ++i) {
    var pms = parts[i].split(/ *= */);
    if ('q' == pms[0]) {
      ret.quality = parseFloat(pms[1]);
    } else {
      ret.params[pms[0]] = pms[1];
    }
  }

  return ret;
}

exports.acceptedViaArray = function(types, str) {
  // not accepted by anything when Accept is not present
  if (!str) { return undefined; }

  // parse
  var accepted = exports.parseAccept(str)
    , normalized = exports.normalizeTypes(types)
    , len = accepted.length;

  for (var i = 0; i < len; ++i) {
    for (var j = 0, jlen = types.length; j < jlen; ++j) {
      if (exports.accept(normalized[j], accepted[i])) {
        return accepted[i];
      }
    }
  }
};

exports.acceptedVia = function(type, str) {
  if ('string' == typeof type) { type = type.split(/ *, */); }
  return exports.acceptedViaArray(type, str);
};


/**
 * Escape special characters in the given string of html.
 *
 * @param {String} html
 * @return {String}
 * @api private
 *
 * CREDIT:
 *   https://github.com/visionmedia/express/blob/3.4.5/lib/utils.js#L261
 */

exports.escape = function(html){
  return String(html)
    .replace(/&(?!\w+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};
