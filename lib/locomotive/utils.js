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
 *      are typically located at `app/controllers` and, by convention, are named
 *      after the resource and suffixed with "_controller" (for example:
 *      band_controller.js).  Note that the path's root directory and file
 *      extension will be stripped by the loader prior to this function being
 *      called.
 *   2. Drawing the application's routes.  In this phase, controller names are
 *      derived from resource names, when declaring resourceful routes, or from
 *      an explicit `controller` option to match routes (which can alternatively
 *      be specified in the shorthand form of `controller#action`).
 *   3. As a `controller` option to routing helpers, such as `urlFor()`.
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
 *   2. As an `action` option to routing helpers, such as `urlFor()`.
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
 * Sanitizes string input from "user-space" application code and normalizes
 * it to the form used when declaring helper functions.
 *
 * "User-space" input comes from one primary source:
 *   1. Drawing the application's routes.  In this phase, helper names are
 *      derived from resource names, when declaring resourceful routes, or from
 *      an explicit `as` option to match routes.
 *
 * Additionally, sanitization is needed when utilizing datastore plugins for
 * model awareness.  In this case, a plugin returns a string to indicate the
 * type of a particular record.  Routing helpers, such as `urlFor()`, convert
 * this string into the corresponding named routing helper, which is invoked
 * directly.
 *
 * Examples:
 *
 *    helperize('FooBar', 'URL');
 *    // => "fooBarURL"
 *
 * @param {String} str
 * @param {String} suffix
 * @return {String}
 * @api protected
 */
exports.helperize = function(str, suffix) {
  if (!str) { return null; }
  
  var s = '';
  
  for (var i = 0; i < arguments.length; ++i) {
    var a = arguments[i];
    if (i === 0) {
      a = a[0].toLowerCase() + a.slice(1);
      s = s.concat(inflect.camelize(a));
    } else {
      s = s.concat(inflect.camelize(a, true));
    }
  }
  
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
  if (!str) { return null; }
  
  var s = str.split('/').map(function(word) {
    return inflect.camelize(word, true);
  }).join('::');
  
  return s;
};


/**
 * Path-ize the given `str`.
 *
 * Transforms normalized controller strings used internally within Locomotive
 * into path form.
 *
 * Transformation is needed when a controller needs to access code or resources
 * in associated files.  In particular, this functionality is heavily used when
 * rendering views, which (absent any overrides) can be automatically loaded
 * based on conventions in the file system heirarchy.
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
exports.pathize = function(str) {
  if (!str) { return null; }
  
  var s = str.replace(/Controller$/, '');
  
  var s = s.split('::').map(function(word) {
    return inflect.underscore(word);
  }).join('/');
  
  return s;
};
