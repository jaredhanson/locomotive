/**
 * Module dependencies.
 */
var lingo = require('lingo');

/**
 * Re-export Lingo module.
 */
exports = module.exports = lingo;


/**
 * Camel-ize the given `str`.
 *
 * Examples:
 *
 *    inflect.camelize('foo_bar');
 *    // => "fooBar"
 *  
 *    inflect.camelize('foo_bar_baz', true);
 *    // => "FooBarBaz"
 *
 * @param {String} str
 * @param {Boolean} uppercaseFirst
 * @return {String}
 * @api public
 */
exports.camelize = function(str, uppercaseFirst) {
  return str.split('_').map(function(word, i){
    if (i || (0 == i && uppercaseFirst)) {
      word = exports.capitalize(word);
    }
    return word;
  }).join('');
};

/**
 * Underscore the given `str`.
 *
 * Examples:
 *
 *    inflect.underscore('FooBar');
 *    // => "foo_bar"
 *  
 *    inflect.underscore('SSLError');
 *    // => "ssl_error"
 *
 * @param {String} str
 * @return {String}
 * @api public
 */
exports.underscore = function(str) {
  str = str.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
  str = str.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
  str = str.replace(/([a-z\d])([A-Z])/g, '$1_$2')
  str = str.replace(/-/g, '_')
  return str.toLowerCase()
};


/**
 * Controller-ize the given `str`.
 *
 * Examples:
 *
 *    inflect._controllerize('Foo');
 *    // => "FooController"
 *  
 *    inflect._controllerize('FooController');
 *    // => "FooController"
 *
 * @param {String} str
 * @return {String}
 * @api protected
 */
exports._controllerize = function(str) {
  if (!str) { return null; }
  str = exports.camelize(str, true)
  
  if (str.lastIndexOf('Controller') != -1) {
    return str;
  }
  return str.concat('Controller');
};

/**
 * Decontroller-ize the given `str`.
 *
 * Examples:
 *
 *    inflect._decontrollerize('FooController');
 *    // => "Foo"
 *  
 *    inflect._decontrollerize('Foo');
 *    // => "Foo"
 *
 * @param {String} str
 * @return {String}
 * @api public
 */
exports._decontrollerize = function(str) {
  if (!str) { return null; }
  return exports.underscore(str.replace(/Controller$/, ''));
};

/**
 * Action-ize the given `str`.
 *
 * Examples:
 *
 *    inflect._actionize('fooBar');
 *    // => "fooBar"
 *  
 *    inflect._actionize('foo_bar');
 *    // => "fooBar"
 *
 * @param {String} str
 * @return {String}
 * @api protected
 */
exports._actionize = function(str) {
  if (!str) { return null; }
  return exports.camelize(str)
};
