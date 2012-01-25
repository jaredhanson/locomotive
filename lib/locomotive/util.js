/**
 * Module dependencies.
 */
var inflect = require('./inflect');


/**
 * Controller-ize the given `str`.
 *
 * Sanitizes string input from "user-space" application code and normalizes
 * it to the form used internally within Locomotive for controllers.
 *
 * Examples:
 *
 *    controllerize('foo_bar');
 *    // => "FooBarController"
 *
 * @param {String} str
 * @return {String}
 * @api public
 */
exports.controllerize = function(str) {
  if (!str) { return null; }
  
  var s = str.split('/').map(function(word) {
    return inflect.camelize(word, true);
  }).join('::');
  
  if (s.lastIndexOf('Controller') === -1) {
    s = s.concat('Controller');
  }
  
  return s;
};

/**
 * Decontroller-ize the given `str`.
 *
 * Transforms normalized controller strings used internally within Locomotive
 * into path form.  This is used, for example, to locate the directory
 * containing views for a specific controller.
 *
 * Examples:
 *
 *    decontrollerize('FooBarController');
 *    // => "foo_bar"
 *
 * @param {String} str
 * @return {String}
 * @api public
 */
exports.decontrollerize = function(str) {
  if (!str) { return null; }
  
  var s = str.replace(/Controller$/, '');
  
  var s = s.split('::').map(function(word) {
    return inflect.underscore(word);
  }).join('/');
  
  return s;
};


/**
 * Action-ize the given `str`.
 *
 * Sanitizes string input from "user-space" application code and normalizes
 * it to the form used internally within Locomotive for actions.
 *
 * Examples:
 *  
 *    actionize('foo_bar');
 *    // => "fooBar"
 *
 * @param {String} str
 * @return {String}
 * @api protected
 */
exports.actionize = function(str) {
  if (!str) { return null; }
  
  var s = str[0].toLowerCase() + str.slice(1);
  return inflect.camelize(s)
};


/**
 * Helper-ize the given `str`.
 *
 * Transforms class type strings into helper form.  This is used, for example,
 * to allow record instances to be passed to `urlFor()` for route building.
 *
 * Examples:
 *
 *    inflect._helperize('FooBar', 'URL');
 *    // => "fooBarURL"
 *
 * @param {String} str
 * @return {String}
 * @api protected
 */
exports.helperize = function(str, suffix) {
  if ('' === str) { return ''; }
  if (!str) { return null; }
  
  var s = str[0].toLowerCase() + str.slice(1);
  s = inflect.camelize(s);
  if (suffix) { s = s.concat(suffix); }
  return s;
};

/**
 * Module-ize the given `str`.
 *
 * Sanitizes string input from "user-space" application code and normalizes
 * it to the form used internally within Locomotive for modules.
 *
 * Examples:
 *
 *    moduleize('foo');
 *    // => "Foo"
 *
 * @param {String} str
 * @return {String}
 * @api public
 */
exports.moduleize = function(str) {
  if ('' === str) { return ''; }
  if (!str) { return null; }
  
  var s = str.split('/').map(function(word) {
    return inflect.camelize(word, true);
  }).join('::');
  
  return s;
};
