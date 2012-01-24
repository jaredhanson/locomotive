/**
 * Module dependencies.
 */
var inflect = require('./inflect');


/**
 * Sanitizes controller `str`.
 *
 * Sanitizes string input from "user-space" application code and normalizes
 * it to the form used internally within Locomotive.
 *
 * Examples:
 *
 *    sanitize.controller('Foo');
 *    // => "FooController"
 *  
 *    sanitize.controller('FooController');
 *    // => "FooController"
 *
 * @param {String} str
 * @return {String}
 * @api protected
 */
exports.controller = function(str) {
  if (!str) { return null; }
  
  var s = str.split('/').map(function(word) {
    return inflect.camelize(word, true);
  }).join('::');
  
  if (str.lastIndexOf('Controller') === -1) {
    s = s.concat('Controller');
  }
  return s;
};
