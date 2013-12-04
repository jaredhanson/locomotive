/**
 * Module dependencies.
 */
var router = require('actionrouter')
  , dispatch = require('./dispatch');


/**
 * Expose `invoke()` function on requests.
 *
 * Once `invoke()` is exposed on a request, it can be called in order to invoke
 * a specific controller and action in a Locomotive appliction.  This is
 * typically done to call into a Locomotive application from middleware or routes
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
 * @param {Application} app
 * @param {Object} options
 * @return {Function}
 * @api protected
 */
module.exports = function(app, options) {
  options = options || {};
  var name = options.name || 'invoke';
  
  return function invokable(req, res, next) {
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
      controller = router.util.controllerize(controller);
      action = router.util.functionize(action);
      next = next || function(err) {
        if (err) { throw err; }
      };
      
      // Dispatch the request to a controller action.
      dispatch(app, controller, action)(req, res, next);
    };
    next();
  };
};
