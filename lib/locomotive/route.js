/**
 * Module dependencies.
 */
var util = require('util');


/**
 * `Route` constructor.
 *
 * @api private
 */
function Route(method, pattern, controller, action) {
  this.method = method;
  this.pattern = pattern;
  this.controller = controller;
  this.action = action;
  normalize(pattern, this.keys = []);
};

/**
 * Build path.
 *
 * Builds a path for the route, substituting any placeholders with the
 * corresponding value from `options`.
 *
 * @param {Object} options
 * @return {String}
 * @api protected
 */
Route.prototype.path = function(options) {
  var self = this;
  var path = this.pattern;
  this.keys.forEach(function(key) {
    if (!key.optional) {
      if (!options[key.name]) { throw new Error('Unable to substitute :' + key.name + ' in route pattern ' + self.pattern); }
      path = path.replace(':' + key.name, options[key.name]);
    } else {
      var replacement = options[key.name] ? '$1' + options[key.name] : '';
      path = path.replace(new RegExp('(\\.?\\/?):' + key.name + '\\?'), replacement);
    }
  });
  
  return path;
}

/**
 * Reverse routing key.
 *
 * A reverse routing key is used to map from a controller and action to a route
 * path.
 *
 * @return {String}
 * @api protected
 */
Route.prototype.reverseKey = function() {
  return this.controller + '#' + this.action;
}


/**
 * Normalize the given path string,
 * returning a regular expression.
 *
 * An empty array should be passed,
 * which will contain the placeholder
 * key names. For example "/user/:id" will
 * then contain ["id"].
 *
 * @param  {String|RegExp} path
 * @param  {Array} keys
 * @param  {Boolean} sensitive
 * @param  {Boolean} strict
 * @return {RegExp}
 * @api private
 *
 * CREDIT: https://github.com/visionmedia/express/blob/2.5.0/lib/router/route.js
 */

function normalize(path, keys, sensitive, strict) {
  if (path instanceof RegExp) return path;
  path = path
    .concat(strict ? '' : '/?')
    .replace(/\/\(/g, '(?:/')
    .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
      keys.push({ name: key, optional: !! optional });
      slash = slash || '';
      return ''
        + (optional ? '' : slash)
        + '(?:'
        + (optional ? slash : '')
        + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
        + (optional || '');
    })
    .replace(/([\/.])/g, '\\$1')
    .replace(/\*/g, '(.*)');
  return new RegExp('^' + path + '$', sensitive ? '' : 'i');
}


/**
 * Expose `Route`.
 */
exports = module.exports = Route;
