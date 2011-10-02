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

Controller.prototype.render = function() {
  var self = this;
  
  // TODO: Implement format (responds_to) support.
  // TODO: Use app setting to determine template extension.
  
  // Enumerate properties set on the controller instance, setting them as local
  // variables of the response.  This makes them available to the view.  Any
  // property that begins with an underscore is considered private, and will not
  // be made local.
  // TODO: Filter out any known "public" properties that should not be made local.
  //       Ex: request, response, etc
  Object.keys(this).forEach(function(key) {
    if (key[0] !== '_') {
      self._res.local(key, self[key]);
    }
  });
  
  var view = this._name.toLowerCase() + '/' + this._action + '.' + 'html' + '.ejs';
  this._res.render(view);
}

Controller.prototype.redirect = function(path) {
  // TODO: apply args
  this._res.redirect(path);
}

Controller.prototype._prepare = function(req, res, next) {
  this._req = req;
  this._res = res;
  this._next = next;
  
  var self = this;
  this.__defineGetter__('request', function() {
    return self._req;
  });
  this.__defineGetter__('response', function() {
    return self._res;
  });
}

Controller.prototype._invoke = function(action) {
  if (typeof this[action] !== 'function') {
    return this._next(new ControllerError(this._name + '#' + action + ' is not callable'));
  }
  
  this._action = action;
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
