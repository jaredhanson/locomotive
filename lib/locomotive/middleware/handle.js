var RouterError = require('../errors').RouterError;

/**
 * Builds a function to handle a route with given `controller` and `action`.
 *
 * @param {String} controller
 * @param {String} action
 * @return {Function}
 * @api private
 */
module.exports = function(controller, action) {
  
  return function handle(req, res, next){
    var prototype = this.controller(controller);
    if (!prototype) {
      return next(new RouterError('No controller for ' + controller + '#' + action));
    }
    
    // Create a new instance of the controller from the prototype.  The
    // prototype acts as a "factory" from which an instance is created for each
    // request.  This allows request-specific properties to be assigned to each
    // instance, without causing conflicts due to concurrency.
    var instance = Object.create(prototype);
    instance._init(req, res, next);
    instance._invoke(action);
  }
}
