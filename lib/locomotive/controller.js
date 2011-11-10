/**
 * Module dependencies.
 */
var hooks = require('hooks')
  , inflect = require('./inflect')
  , util = require('util')
  , ControllerError = require('./errors').ControllerError;


/**
 * `Controller` constructor.
 *
 * @api public
 */
function Controller() {
}

/**
 * Return the value of param `name` when present or `defaultValue`.
 *
 * For convenience, this function is aliased to `params`.
 * 
 * Examples:
 *
 *     this.param('id');
 *
 *     this.param('full_text', false);
 *
 * For further details, see `express.Request#param()` as `param()` invokes it
 * internally.
 *
 * @param {String} pattern
 * @param {Mixed} defaultValue
 * @return {String}
 * @api public
 */
Controller.prototype.param =
Controller.prototype.params = function(name, defaultValue) {
  return this.__req.param.apply(this.__req, arguments);
}

/**
 * Render response.
 *
 * Render `template`, defaulting to the template for the current action, with
 * optional `options`.
 *
 * Options:  
 *  - `format`  response format, defaults to `'html'`
 *  - `engine`  view engine, defaults to `'view engine'` setting or `'ejs'`
 *
 * Examples:
 *
 *     this.render();
 *
 *     this.render('show');
 *
 *     this.render({ format: 'xml' });
 *
 * @param {String} template
 * @param {Object} options
 * @api public
 */
Controller.prototype.render = function(template, options) {
  if (!options && typeof template === 'object') {
    options = template;
    template = null;
  }
  options = options || {};

  var self = this;
  var app = this.__req.app;
  var tmpl = template || inflect.underscore(this.__action);
  var fmt = options.format || 'html';
  var eng = options.engine || (app && app.set('view engine')) || 'ejs';
  
  tmpl = (tmpl.indexOf('/') === -1) ? this.__viewDir + '/' + tmpl : tmpl;
  
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
  
  var view = tmpl + '.' + fmt + '.' + eng;
  this.__res.render(view);
}

/**
 * Redirect to `url` with optional `status`, defaulting to 302.
 *
 * Examples:
 *
 *     this.redirect('/login');
 *
 *     this.redirect('http://www.example.com/', 303);
 *
 * For further details, see `express.Request#redirect()` as `redirect()` invokes
 * it internally.
 *
 * @param {String} url
 * @param {Number} status
 * @api public
 */
Controller.prototype.redirect = function(url, status) {
  this.__res.redirect.apply(this.__res, arguments);
}

/**
 * Internal error encountered while executing action.
 *
 * Controllers should call this function when an internal error occurs during
 * the execution of an action; for example, if a database is not available.
 *
 * Examples:
 *
 *     this.error(new Error('something went wrong'));
 *
 * @param {Error} err
 * @api public
 */
Controller.prototype.error = function(err) {
  return this.__next(err);
}


/**
 * Internal init.
 *
 * This function initializes a controller's internal properties.  It is called
 * once, upon being registered with Locomotive during the application's start
 * phase.
 *
 * @api private
 */
Controller.prototype._init = function(name) {
  this.__name = name;
  this.__viewDir = inflect._decontrollerize(name);
}

/**
 * Prepare for invocation.
 *
 * This function prepares a controller to be invoked.  It is called prior to the
 * action being invoked, and initializes internal properties pertaining to the
 * request-response cycle.
 *
 * A new controller instance is created for each request that is being handled.
 * This allows request-specific properties to be assigned to the controller,
 * without risk of conflicts due to concurrency.  The request and response will
 * be assigned as properties named `req` (also aliased as `request`) and `res`
 * (also aliased as `response`), respectively.
 *
 * @param {ServerRequest} req
 * @param {ServerResponse} res
 * @param {Function} next
 * @api private
 */
Controller.prototype._prepare = function(req, res, next) {
  this.__req = req;
  this.__res = res;
  this.__next = next;
  
  var self = this;
  this.__defineGetter__('req', function() {
    return self.__req;
  });
  this.__defineGetter__('request', function() {
    return self.__req;
  });
  this.__defineGetter__('res', function() {
    return self.__res;
  });
  this.__defineGetter__('response', function() {
    return self.__res;
  });
}

/**
 * Invoke action.
 *
 * @param {String} action
 * @api private
 */
Controller.prototype._invoke = function(action) {
  if (typeof this[action] !== 'function') {
    return this.__next(new ControllerError(this.__name + '#' + action + ' is not a function'));
  }
  
  this.__action = action;
  // Record the controller's own properties prior to invoking the action.  Any
  // properties assigned while executing the action will be made available to
  // the view.  The previously existing properties will be filtered out.
  this.__ownProperties = Object.getOwnPropertyNames(this);
  
  this[action]();
}


// TODO: Wrap pre and post with before and after, and test accordingly.

// Add hooks to support pre and post filters.
for (var k in hooks) {
  Controller.prototype[k] = Controller[k] = hooks[k];
}


/**
 * Expose `Controller`.
 */
module.exports = Controller;
