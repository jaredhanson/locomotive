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
 *    inflect.camelcase('foo_bar_baz', true);
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
 * Controller-ize the given `str`.
 *
 * Examples:
 *
 *    inflect.controllerize('Foo');
 *    // => "FooController"
 *  
 *    inflect.controllerize('FooController');
 *    // => "FooController"
 *
 * @param {String} str
 * @return {String}
 * @api public
 */
exports.controllerize = function(str) {
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
 *    inflect.controllerize('FooController');
 *    // => "Foo"
 *  
 *    inflect.controllerize('Foo');
 *    // => "Foo"
 *
 * @param {String} str
 * @return {String}
 * @api public
 */
exports.decontrollerize = function(str) {
  return str.replace(/Controller$/, '');
};

/**
 * Underscore the given `str`.
 *
 * Examples:
 *
 *    inflect.controllerize('FooBar');
 *    // => "foo_bar"
 *  
 *    inflect.controllerize('SSLError');
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
