/**
 * Module dependencies.
 */
var url = require('url')
  , util = require('util')
  , utils = require('../../utils')


/**
 * Generate a URL based on the `options` provided.
 *
 * When generating a route to a controller and action, the path will be
 * generated based on the routing pattern.  Any placeholders in the pattern
 * will be substitued with the corresponding value in `options`.
 *
 * Options:
 *  - `controller`  map URL to controller
 *  - `action`      map URL to action within controller
 *  - `onlyPath`    generate relative URL, defaults to _false_
 *
 * `urlFor()` is also model aware.  Records can be passed directly as arguments,
 * in which case Locomotive will introspect the record to build the
 * corresponding URL.
 *
 *     var animal = new Animal({ id: 123 });
 *     urlFor(animal);
 *     // => http://www.example.com/animals/123
 *
 * When taking advantage of model awareness, be sure to configure Locomotive
 * with adapters for your application's datastore(s) to ensure that
 * introspection is able to determine the correct record type.  For example:
 *
 *    this.datastore(require('locomotive-mongoose'));
 *
 * For additional options, see `url.format()` in Node's standard library, as
 * `urlFor` uses it internally.
 *
 * Common Options for `url.format()`:
 *  - `protocol`
 *  - `host`
 *  - `pathname`
 *
 * @param {Object} options
 * @return {String}
 * @api public
 */
function urlFor(req, res) {
  
  return function(options) {
    options = options || {};
    var app = req._locomotive.app;
    
    // If the argument is a record from a datastore, find and call the
    // corresponding named routing helper.
    if (options.constructor.name !== 'Object') {
      var opts = arguments[1] || {};
      var recordof = app._recordOf(options);
      if (!recordof) { throw new Error('Unable to determine record of ' + options); }
      var helperName = utils.helperize(recordof, 'URL');
      if (opts.onlyPath) {
        helperName = utils.helperize(recordof, 'Path');
      }
      var helperFn = this[helperName];
      if (!helperFn || (typeof helperFn !== 'function')) { throw new Error('No routing helper named ' + helperName); }
      return helperFn.call(this, options);
    }
    
    options.controller = utils.controllerize(options.controller) || req._locomotive.controller;
    options.action = utils.actionize(options.action) || req._locomotive.action;
    
    if (req.headers && req.headers['host']) {
      options.protocol = options.protocol || 'http';
      options.host = options.host || req.headers['host'];
    }
    
    var urlObj = options;
    if (!options.pathname) {
      var route = app._routes.find(options.controller, options.action);
      if (!route) { throw new Error('No route for ' + options.controller + '#' + options.action); }
      options.pathname = route.path(options);
    }
    
    if (options.onlyPath) {
      return url.format({ pathname: options.pathname })
    }
    return url.format(urlObj);
  }
}


/**
 * Export helpers.
 */
exports.urlFor = urlFor;
