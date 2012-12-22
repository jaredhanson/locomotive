/**
 * Module dependencies.
 */
var utils = require('../utils');


/**
 * Expose `invoke()` function on requests.
 *
 * Once `invoke()` is exposed on a request, it can be called in order to invoke
 * a specific controller and action in a Locomotive appliction.  This is
 * typically done to call into a Locmotive application from middleware or routes
 * that exist outside of the application itself.
 *
 * If a request is being processed from within a controller, it is recommended
 * to use `this.invoke()` on the controller, rather than `req.invoke()`.
 *
 * Examples:
 *
 *     this.express.get(/regex/, function(req, res, next) {
 *       req.invoke('foo', 'bar', next);
 *     });
 *
 *     this.express.get(/regex/, function(req, res, next) {
 *       req.invoke('foo#bar', next);
 *     });
 *
 * @return {Function}
 * @api protected
 */
module.exports = function(options) {
  options = options || {};
  var name = options.name || 'invoke';
  
  return function(req, res, next) {
    // This middleware is bound with a `this` context of a Locmotive app.
    var app = this;
  
    req[name] = function(controller, action, next) {
      if (typeof action == 'function') {
        next = action;
        action = undefined;
      }
      if (!action) {
        var split = controller.split('#');
        if (split.length > 1) {
          // shorthand controller#action form
          controller = split[0];
          action = split[1];
        }
      }
      controller = utils.controllerize(controller);
      action = utils.actionize(action);
      next = next || function(err) {
        if (err) { throw err; }
      };
    
      // Get the middleware that the Locomotive router uses to handle requests,
      // binding it to a controller and action.
      var handle = app._routes._handle(controller, action).bind(app);
      // Forward the current request into Locomotive to be handled by a
      // controller and action.
      handle(req, res, next);
    };
    next();
  }
}
