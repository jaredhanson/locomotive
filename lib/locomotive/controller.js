/**
 * Module dependencies.
 */
var hooks = require('hooks')
  , lingo = require('lingo')
  , util = require('util')
  , ControllerError = require('./errors').ControllerError;


/**
 * `Controller` constructor.
 *
 * @api public
 */
function Controller() {
}

// TODO: Add init method, which will be called after creating a controller,
//       before invoking actions.

/**
 * Return the value of param `name` when present or `defaultValue`.
 *
 * For further details, see `express.Request::param()` as `param()` invokes it
 * internally.
 *
 * For convenience, `param` is aliased to `params`.
 * 
 * Examples:
 *
 *     this.param('id');
 *
 *     this.param('full_text', false);
 *
 * @param {String} pattern
 * @param {Mixed} defaultValue
 * @return {String}
 * @api public
 */
Controller.prototype.param =
Controller.prototype.params = function(name, defaultValue) {
  return this.__req.param(name, defaultValue)
}

/**
 * Render the response.
 *
 * @api public
 */
Controller.prototype.render = function() {
  var self = this;
  
  // TODO: Implement format (responds_to) support.
  // TODO: Use app setting to determine template extension.
  
  // Filter function to capture the controller's local properties, which will
  // be made available to the view.  Any private property (defined as a property
  // whose name begins with an underscore), or property existing prior to
  // invoking the action will be filtered out.
  function localProperties(prop) {
    if (prop[0] === '_') { return false };
    if (self.__ownProperties.indexOf(prop) != -1) { return false };
    return true;
  }
  
  Object.keys(this).filter(localProperties).forEach(function(key) {
    self.__res.local(key, self[key]);
  });
  
  var view = this._name.toLowerCase() + '/' + this.__action + '.' + 'html' + '.ejs';
  this.__res.render(view);
}

Controller.prototype.redirect = function(path) {
  // TODO: apply args
  this.__res.redirect(path);
}

Controller.prototype._prepare = function(req, res, next) {
  this.__req = req;
  this.__res = res;
  this.__next = next;
  
  var self = this;
  this.__defineGetter__('request', function() {
    return self.__req;
  });
  this.__defineGetter__('response', function() {
    return self.__res;
  });
}

Controller.prototype._invoke = function(action) {
  if (typeof this[action] !== 'function') {
    return this.__next(new ControllerError(this._name + '#' + action + ' is not callable'));
  }
  
  this.__action = action;
  
  // Record the controller's own properties prior to invoking the action.  Any
  // properties assigned while executing the action will be made available to
  // the view.  The previously existing properties will be filtered out.
  this.__ownProperties = Object.getOwnPropertyNames(this);
  
  this[action]();
}


// Add hooks to support pre and post filters.
for (var k in hooks) {
  Controller.prototype[k] = Controller[k] = hooks[k];
}


/**
 * Expose `Controller`.
 */
module.exports = Controller;
