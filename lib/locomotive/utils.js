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
 * "User-space" input comes from three primary sources:
 *   1. Paths on the file system containing source code of controllers.  These
 *      are typically located at (APP_ROOT)/app/controllers and, by convention,
 *      are named after the resource and suffixed with "_controller" (for
 *      example: band_controller.js).  Note that the path's root directory
 *      and file extension will be stripped by the loader prior to this function
 *      being called.
 *   2. Drawing the application's routes.  In this phase, controller names are
 *      derived from resource names, when declaring resourceful routes, or from
 *      an explicit `controller` option to match routes (which can alternatively
 *      be specified in the shorthand form of `controller#action`).
 *   3. As a `controller` option to routing helpers, such as urlFor().
 *
 * Examples:
 *
 *    controllerize('foo_bar');
 *    // => "FooBarController"
 *
 *    controllerize('fulano/foo_bar');
 *    // => "Fulano::FooBarController"
 *
 * @param {String} str
 * @return {String}
 * @api protected
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
 * @api protected
 */
// TODO: Rename this to pathize, which better reflects its purpose.
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
 * "User-space" input comes from two primary sources:
 *   1. Drawing the application's routes.  In this phase, action names are
 *      derived from an explicit `action` option to match routes (which can
 *      alternatively be specified in the shorthand of `controller#action`).
 *      Note that resourceful routes follow conventions for action names, and
 *      thus are not subject to sanitization.
 *   2. As an `action` option to routing helpers, such as urlFor().
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
 * A module is synonymous with a namespace.  For instance, if an "admin"
 * namespace is declared, within which `PostsController` resides, the
 * controller's fully qualified name would be `Admin::PostsController`.  In
 * other words, `PostsController` resides in the `Admin` module.
 *
 * "User-space" input comes from one primary source:
 *   1. Drawing the application's routes.  In this phase, module names are
 *      derived from route namespaces.  If nested, each inner namespace becomes
 *      a segment of the fully qualified form.
 *
 * Examples:
 *
 *    moduleize('foo');
 *    // => "Foo"
 *
 * @param {String} str
 * @return {String}
 * @api protected
 */
exports.moduleize = function(str) {
  if ('' === str) { return ''; }
  if (!str) { return null; }
  
  var s = str.split('/').map(function(word) {
    return inflect.camelize(word, true);
  }).join('::');
  
  return s;
};
