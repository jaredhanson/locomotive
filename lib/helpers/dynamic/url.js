/**
 * Module dependencies.
 */
var url = require('url')
  , router = require('actionrouter');


/**
 * Generate a URL based on the `options` provided.
 *
 * When generating a route to a controller and action, the path will be
 * generated based on the URL pattern.  Any placeholders in the pattern will be
 * substitued with the corresponding value in `options`.
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
 *     this.datastore(require('locomotive-mongoose'));
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
      if (!recordof) { throw new Error("Unable to determine record type of '" + options.constructor.name + "'"); }
      var helperName = router.util.functionize(recordof, 'URL');
      if (opts.onlyPath) {
        helperName = router.util.functionize(recordof, 'Path');
      }
      var helperFn = this[helperName];
      if (!helperFn || (typeof helperFn !== 'function')) { throw new Error("No routing helper named '" + helperName + "'"); }
      return helperFn.call(this, options);
    }
    
    options.controller = router.util.controllerize(options.controller) || req._locomotive.controller;
    options.action = router.util.functionize(options.action) || req._locomotive.action;
    
    if (req.headers && req.headers.host) {
      options.protocol = options.protocol || req.protocol || 'http';
      options.host = options.host || req.headers.host;
    }
    
    if (!options.pathname) {
      var route = app._routeTo(options.controller, options.action);
      if (!route) { throw new Error("No route to '" + options.controller + "#" + options.action + "'"); }
      options.pathname = route.path(options);
    }
    
    if (options.onlyPath) {
      return url.format({ pathname: options.pathname });
    }
    return url.format(options);
  };
}


/**
 * Export helpers.
 */
exports.urlFor = urlFor;
