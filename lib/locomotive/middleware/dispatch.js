var DispatchError = require('../errors/dispatcherror');

/**
 * Dispatch to given `controller` and `action` in `app`.
 *
 * @param {Application} app
 * @param {String} controller
 * @param {String} action
 * @return {Function}
 * @api private
 */
module.exports = function(app, controller, action) {
  
  return function dispatch(req, res, next) {
    app._controller(controller, function(err, ctrl) {
      if (err) { return next(new DispatchError(err.message)); }
      
      // FIXME: Loading hack that should be removed
      if (!ctrl.__app && ctrl._load) {
        ctrl._load(app, controller);
      }
      
      ctrl._prepare(req, res, next);
      ctrl._invoke(action);
    });
  }
}
