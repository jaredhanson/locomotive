/**
 * Module dependencies.
 */
var router = require('actionrouter')
  , mime = require('express').mime
  , utils = require('./utils')
  , flatten = require('utils-flatten')
  , dispatch = require('./middleware/dispatch')
  , ControllerError = require('./errors/controllererror');


/**
 * `Controller` constructor.
 *
 * @api public
 */
function Controller() {
  this.__beforeFilters = [];
  this.__afterFilters = [];
}

/**
 * Return the value of param `name` when present or `defaultValue`.
 *
 *  - Checks route placeholders, ex: _/user/:id_
 *  - Checks body params, ex: id=12, {"id":12}
 *  - Checks query string params, ex: ?id=12
 *
 * To utilize request bodies, `req.body` should be an object. This can be done
 * by using `express.bodyParser()` middleware.
 *
 * For convenience, this function is aliased to `params`.
 * 
 * Examples:
 *
 *     this.param('id');
 *
 *     this.param('full_text', false);
 *
 * For further details, see `express.Request#param()`, as `param()` invokes it
 * internally.
 *
 * @param {String} pattern
 * @param {Mixed} [defaultValue]
 * @return {String}
 * @api public
 */
Controller.prototype.param =
Controller.prototype.params = function(name, defaultValue) {
  return this.__req.param.apply(this.__req, arguments);
};

/**
 * Render response.
 *
 * Render `template`, defaulting to the template for the current action, with
 * optional `options`.  If optional callback `fn` is given, the response will
 * not be sent, but rather supplied to the callback.
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
 *     this.render('email', function(err, body) {
 *       // send email with `body`
 *     });
 *
 * @param {String} template
 * @param {Object} options
 * @param {Function} fn
 * @api public
 */
Controller.prototype.render = function(template, options, fn) {
  if (typeof options === 'function') {
    fn = options;
    options = undefined;
  } else if (typeof template === 'function') {
    fn = template;
    options = undefined;
    template = undefined;
  }
  if (!options && typeof template === 'object') {
    options = template;
    template = undefined;
  }
  if (typeof options == 'string') {
    options = { format: options };
  }
  options = options || {};

  var self = this;
  var app = this.__req.app;  // Express app
  var tmpl = template || this.__action
    , fmt = utils.extensionizeType(options.format || 'html');
  
  tmpl = (tmpl.indexOf('/') === -1) ? this.__id + '/' + tmpl : tmpl;
  tmpl = this.__app.views.resolve(tmpl);
  
  // Filter function to capture the controller's local properties, which will
  // be made available to the view.  Any private property (defined as a property
  // whose name begins with an underscore), or property existing prior to
  // invoking the action will be filtered out.
  function localProperties(prop) {
    if (prop[0] == '_') { return false; }
    if (self.__ownProperties.indexOf(prop) != -1) { return false; }
    return true;
  }
  
  Object.keys(this).filter(localProperties).forEach(function(key) {
    var value = self[key];

    // Make sure functions are always run in the current controllers` context.
    // TODO: Implement test case for this.
    if (value instanceof Function) {
      value = value.bind(self);
    }

    self.__res.locals[key] = value;
  });
  
  var fopts = this.__app._formats[fmt] || {}
    , comps = [ tmpl, fmt, (app && app.set('view engine')) || 'ejs' ]
    , ext;
  if (options.engine) {
    comps = [ tmpl, fmt, options.engine ];
  } else if (options.extension) {
    ext = options.extension;
    if ('.' == ext[0]) { ext = ext.slice(1); }
    comps = [ tmpl, ext ];
  } else if (fopts.engine) {
    comps = [ tmpl, fmt, fopts.engine ];
  } else if (fopts.extension) {
    ext = fopts.extension;
    if ('.' == ext[0]) { ext = ext.slice(1); }
    comps = [ tmpl, ext ];
  }
  
  if (!this.__res.getHeader('Content-Type') && !fn) {
    var type = utils.normalizeType(options.mime || options.format || 'html').value
      , charset = options.charset || mime.charsets.lookup(type);
    if (charset) { type += '; charset=' + charset; }
    
    this.__res.setHeader('Content-Type', type);
  }
  
  // delete option keys consumed by Locomotive
  delete options.format;
  delete options.mime;
  delete options.charset;
  delete options.engine;
  delete options.extension;
  
  var view = comps.join('.');
  this.__res.render(view, options, fn);
};

/**
 * Respond to the acceptable formats using an `obj` of format keys containing
 * options or or callbacks.
 *
 * This method uses `req.params.format` or `req.accepted`, an array of
 * acceptable types ordered by their quality values.  When both the `format`
 * parameter and "Accept" header are not present the _first_ format key is used,
 * otherwise the first match is used. When no match is obtained the server
 * responds with 406 "Not Acceptable".
 *
 * `obj` can contain format keys with either object or function values.  When
 * containing an object, `render()` will be invoked with the template and
 * options found in the object.
 *
 *     this.respond({
 *       'json': { template: 'jrd', engine: 'jsonb' },
 *       'xml': { template: 'xrd', engine: 'xmlb' }
 *     });
 *
 * If the template and options are defaults, which don't need to be overridden,
 * simply set the format key to `true`.
 *
 *     this.respond({
 *       'json': true,
 *       'xml': true
 *     });
 *
 * Set the format key to a function, which will be invoked if the format is
 * acceptable.  This allows fine-grained control of the response.
 *
 *     this.respond({
 *       'xml': function() { self.render('atom', { engine: 'xmlb' }); },
 *       default: function() { self.render(); }
 *     })
 *
 * By default Locomotive passes an `Error` with a `.status` of 406 to
 * `next(err)` if a match is not made. If you provide a `default` format key, it
 * will be invoked instead.
 * 
 * @param {Object} obj
 * @api public
 */
Controller.prototype.respond =
Controller.prototype.respondWith = function(obj) {
  var req = this.__req
    , res = this.__res
    , format = this.__req.params.format;
  format = format ? mime.lookup(format) : undefined;
  
  if (Array.isArray(obj) || typeof obj == 'string') {
    var arr = flatten([].slice.call(arguments))
      , o = {}, i, len;
    for (i = 0, len = arr.length; i < len; ++i) { o[arr[i]] = true; }
    obj = o;
  }
    
  var op = obj.default;
  if (op) { delete obj.default; }
  var keys = Object.keys(obj);

  // prefer format param, fallback to accept header
  var key = format ? utils.accepts(keys, format) : req.accepts(keys);
  var via = format ? undefined : utils.acceptedVia(keys, req.headers.accept);
  
  if (op && via && via.type == '*' && via.subtype == '*') {
    // use default format, if available and negotiated via */*
    key = undefined;
  } else if (via && via.type == '*' && via.subtype == '*') {
    // use first format, if no default and accepts anything
    key = keys[0];
  }
  
  if (key) {
    op = obj[key];
  }
  if (op === true) { op = {}; }
  else if (typeof op === 'string') { op = { format: op }; }
  
  var vary = this.__res.getHeader('Vary');
  if (!vary) {
    res.setHeader('Vary', 'Accept');
  } else {
    vary = vary.split(/ *, */);
    if (vary.indexOf('Accept') == -1) { vary.push('Accept'); }
    res.setHeader('Vary', vary.join(', '));
  }
  
  if (typeof op == 'object') {
    var template = op.template; delete op.template;
    op.format = op.format || key;
    if (key && key.indexOf('/') != -1) { op.mime = key; }
    this.render(template, op);
  } else if (typeof op == 'function') {
    op();
  } else {
    var err = new Error('Not Acceptable');
    err.status = 406;
    err.types = utils.normalizeTypes(keys).map(function(o) { return o.value; });
    this.error(err);
  }
};

/**
 * Redirect to `url` with optional `status`, defaulting to 302.
 *
 * Examples:
 *
 *     this.redirect('/login');
 *
 *     this.redirect('http://www.example.com/', 303);
 *
 *     this.redirect(303, 'http://www.example.com/');
 *
 * For further details, see `express.Request#redirect()`, as `redirect()` invokes
 * it internally.
 *
 * @param {String} url
 * @param {Number} status
 * @api public
 */
Controller.prototype.redirect = function(url, status) {
  if (2 == arguments.length && typeof url == 'number') {
    // express 2.x signature
    this.__res.redirect.call(this.__res, status, url);
    return;
  }
  this.__res.redirect.apply(this.__res, arguments);
};

/**
 * Invoke a different controller's action in order to process the current
 * request.
 *
 *     this.invoke('users', 'show');
 *     // => invokes show action of usersController
 *
 * Shorthand notation can also be used.
 *
 *     this.invoke('users#show');
 *     // => invokes show action of usersController
 *
 * `controller` is optional.  If not given, it will invoke a different action in
 * the current controller.
 *
 *     this.invoke('other');
 *     // => invokes other action of current controller
 *
 * Calling this function immediately halts the filter chain.  After filters will
 * not be applied.
 *
 * @param {String} controller
 * @param {Number} action
 * @api public
 */
Controller.prototype.invoke = function(controller, action) {
  if (!action) {
    var split = controller.split('#');
    if (split.length > 1) {
      // shorthand controller#action form
      controller = split[0];
      action = split[1];
    } else {
      action = controller;
      controller = this.__id;
    }
  }
  controller = router.util.controllerize(controller);
  action = router.util.functionize(action);
  
  // Prevent after filters from being applied.
  this.__devoked = true;
  // Re-dispatch the current request to a different controller action.
  dispatch(this.__app, controller, action)(this.__req, this.__res, this.__next);
};

/**
 * Finish action processing, without issuing a response.
 * 
 * Controllers can use this function to jump immediately to any after filters
 * registered for the currently executing action.  This circumstance is unusual,
 * but can be used in cases where it is desired to respond to the request from
 * within an after filter rather than the action function.
 *
 * Examples:
 *
 *     this.done();
 *
 * @api public
 */
Controller.prototype.done = function() {
  this._devoke();
};

/**
 * Internal error encountered while executing action.
 *
 * Controllers should call this function when an internal error occurs during
 * the execution of an action; for example, if a database is not available.
 *
 * This function is also aliased as `next`, and if called without an `err`
 * allows a controller to pass control back to Express.  This is useful in
 * certain scenarios, but is generally not encouraged.
 *
 * Examples:
 *
 *     this.error(new Error('something went wrong'));
 *
 * @param {Error} err
 * @api public
 */
Controller.prototype.next =
Controller.prototype.error = function(err) {
  var self = this;
  // Give controller-level after filters an opportunity to handle the error.  If
  // not handled, pass control out to Express for application-level handling.
  this._devoke(err, function(e) {
    return self.__next(e);
  });
};

/**
 * Add a before filter for `action`.
 *
 * A before filter runs before an action.  Multiple filters can be registered,
 * and they will execute sequentially, one after the other, as each calls
 * `next`.  Any filter can call `next` with an `err`, halting the filter chain
 * and bypassing the action.
 *
 * Filters are especially useful for loading records from a database, ensuring
 * authorization, and avoiding nested blocks of async code.
 *
 * Examples:
 *
 *     PostsController.before('show', function(next) {
 *       var self = this;
 *       Post.findById(this.param('id'), function(err, post) {
 *         if (err) { return next(err); }
 *         self.post = post;
 *         next();
 *       });
 *     });
 *
 * @param {String|String[]} action
 * @param {Function} fn
 * @api public
 */
Controller.prototype.before = function(action, fn) {
  if (Array.isArray(action)) {
    // If multiple actions specified, add the filter to each of them.
    for (var i = 0, len = action.length; i < len; i++) {
      this.__beforeFilters.push({ action: action[i], fn: fn });
    }
  } else {
    this.__beforeFilters.push({ action: action, fn: fn });
  }
  return this;
};

/**
 * Add a after filter for `action`.
 *
 * An after filter runs after an action.  Multiple filters can be registered,
 * and they will execute sequentially, one after the other, as each calls
 * `next`.  Any filter can call `next` with an `err`, halting the filter chain.
 *
 * Examples:
 *
 *     PostsController.after('show', function(next) {
 *       // log response time for calculating performance metrics
 *       next();
 *     });
 *
 * @param {String|String[]} action
 * @param {Function} fn
 * @api public
 */
Controller.prototype.after = function(action, fn) {
  // check if action contains a list of actions
  if (Array.isArray(action)) {
    // If multiple actions specified, add the filter to each of them.
    for (var i = 0, len = action.length; i < len; i++) {
      this.__afterFilters.push({ action: action[i], fn: fn });
    }
  } else {
    this.__afterFilters.push({ action: action, fn: fn });
  }
  return this;
};

/**
 * Invoked when controller is initialized by Locomotive.
 *
 * This function is called immediately after Locomotive instantiates the
 * controller.  It is used to give the controller a reference to the app and to
 * declare its registered ID.
 *
 * @param {Application} app
 * @param {String} id
 * @api private
 */
Controller.prototype._init = function(app, id) {
  this.__app = app;
  this.__id = id;
};

/**
 * Invoked when controller is being prepared to invoke an action.
 *
 * This function is called immediately after the controller is initialized,
 * prior to invoking the action.  It is used to initialize properties pertaining
 * to the request-response pair.
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
  this.__defineGetter__('app', function() {
    return self.__app;
  });
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
  
  // Record the controller's own properties prior to invoking the action.  Any
  // properties assigned while executing the action will be made available to
  // the view.  The previously existing properties will be filtered out.
  this.__ownProperties = Object.getOwnPropertyNames(this);
};

/**
 * Invoke action.
 *
 * @param {String} action
 * @api private
 */
Controller.prototype._invoke = function(action) {
  if (typeof this[action] !== 'function') {
    return this.__next(new ControllerError(this.__id + '#' + action + ' is not a function'));
  }
  
  this.__action = action;
  
  // Assign Locomotive properties to request.  These properties are used by
  // helper functions, such as urlFor(), to return results based on the context
  // of the request and response.
  this.__req._locomotive = {};
  this.__req._locomotive.app = this.__app;
  this.__req._locomotive.controller = this.__id;
  this.__req._locomotive.action = this.__action;
  
  // Merge helpers into this controller.  The controller will have access to the
  // helpers through the `this` context, and the view will have access via
  // locals.
  // TODO: Implement test case for this.
  var helpers = this.__app._helpers
    , dynamicHelpers = this.__app._dynamicHelpers
    , key;
  for (key in helpers) {
    this[key] = helpers[key];
  }
  for (key in dynamicHelpers) {
    this[key] = dynamicHelpers[key].call(undefined, this.__req, this.__res);
  }
  
  
  // Invoke the action, applying any before filters first.
  var self = this
    , filters = this.__beforeFilters
    , filter
    , i = 0;
   
  // Apply after filters once the response is finished.
  this.__res.once('finish', function() {
    self._devoke();
  });
    
  (function iter(err, data) {
    if (err) { return self.error(err); }

    filter = filters[i++];
    if (!filter) {
      // filters done, invoke action
      try {
        // TODO: Implement promise support for before and after filters.
        var promise = self[action](data);
        if (promise && typeof promise.then == 'function') {
          promise.then(null, function(err) {
            self.error(err);
          });
        }
        return;
      } catch (ex) {
        return self.error(ex);
      }
    }

    // Skip non-matching filter
    if (filter.action != '*' && filter.action != action) { return iter(err, data); }
    
    // Invoke before filter
    try {
      var arity = filter.fn.length;
      if (arity == 3) {
        // Support for Connect middleware being used directly as a filter.
        filter.fn.call(self, self.req, self.res, iter);
      } else if (arity == 2) {
        filter.fn.call(self, data, iter);
      } else if (arity < 2) {
        filter.fn.call(self, iter);
      } else {
        iter(err, data);
      }
    } catch (ex) {
      iter(ex);
    }
  })();
};

/**
 * Devoke action.
 *
 * Devoking an action will cause any after filters to be invoked.  This happens
 * after an action renders a response or redirects.  It also happens after an
 * error is detected, either by the application calling `error` or catching an
 * exception.
 *
 * @param {Error} err
 * @param {Function} cb
 * @api private
 */
Controller.prototype._devoke = function(err, cb) {
  if (this.__devoked) { return; }
  this.__devoked = true;

  var self = this
    , action = this.__action
    , filters = this.__afterFilters
    , filter
    , i = 0;

  (function iter(err) {
    filter = filters[i++];
    if (!filter) {
      // filters done
      cb && cb(err);
      return;
    }

    if (filter.action != '*' && filter.action != action) { return iter(err); }

    // invoke after filters
    try {
      var arity = filter.fn.length;
      if (err) {
        if (arity == 4) {
          filter.fn.call(self, err, self.req, self.res, iter);
        } else {
          iter(err);
        }
      } else {
        if (arity == 2 || arity == 3) {
          // Support for Connect middleware being used directly as a filter.
          filter.fn.call(self, self.req, self.res, iter);
        } else if (arity < 2) {
          filter.fn.call(self, iter);
        } else {
          iter();
        }
      }
    } catch (ex) {
      iter(ex);
    }
  })(err);
};


/**
 * Expose `Controller`.
 */
module.exports = Controller;
