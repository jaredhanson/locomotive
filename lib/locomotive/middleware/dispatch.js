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
      if (err) { return next(err); }
      
      // FIXME: Loading hack that should be removed
      if (!ctrl.__app) {
        console.log('DOES NOT HAVE APP YET');
        ctrl._load(app, controller);
      }
      
      ctrl._init(req, res, next);
      ctrl._invoke(action);
    });
  }
}
