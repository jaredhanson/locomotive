/**
 * Module dependencies.
 */
var lingo = require('lingo');


/**
 * Re-export capitalize from lingo.
 */
exports.capitalize = lingo.capitalize;

/**
 * Decapitalize the first word of `str`.
 *
 * Examples:
 *
 *    decapitalize('Hello there');
 *    // => "hello there"
 *
 * @param {String} str
 * @return {String}
 * @api public
 */
exports.decapitalize = function(str) {
  return str[0].toLowerCase() + str.slice(1);
}

/**
 * Camel-ize the given `str`.
 *
 * Examples:
 *
 *    camelize('foo_bar');
 *    // => "fooBar"
 *  
 *    camelize('foo_bar_baz', true);
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
 *    underscore('FooBar');
 *    // => "foo_bar"
 *  
 *    underscore('SSLError');
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
    return exports.camelize(word, true);
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
  
  var s = exports.decapitalize(str);
  return exports.camelize(s)
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
      a = exports.decapitalize(a);
      s = s.concat(exports.camelize(a));
    } else {
      s = s.concat(exports.camelize(a, true));
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
    return exports.camelize(word, true);
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
    return exports.underscore(word);
  }).join('/');
  
  return s;
};


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
}
