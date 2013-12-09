/**
 * Module dependencies.
 */
var express = require('express')
  , utils = require('../utils')
  , dispatch = require('../middleware/dispatch')
  , entryHelper = require('../helpers/route/entry')
  , patternHelper = require('../helpers/route/pattern');


/**
 * Express underlay.
 *
 * This module sets up an underlying Express app for the Locomotive application.
 *
 * Locomotive is just a collection of higher-level constructs layered on top of
 * Express, bringing structure and conventions used when building RESTful web
 * applications using the MVC pattern.
 *
 * Express is used as the underlay, handling the middleware stack and
 * routing requests.  This allows existing knowledge and the ecosystem of
 * Express middleware and view engines to be reused.
 *
 * @param {String} env
 * @api private
 */
module.exports = function(env) {
  env = env || process.env.NODE_ENV || 'development';
  var self = this
    , app = express();
  
  // Configure the router.
  //
  // The router needs a handler (which dispatches requests to a controller
  // action), a mechanism to mount those handlers in the underlying Express app,
  // and routing assistance which declares route helpers.
  this.__router.handler(function(controller, action) {
    return dispatch(self, controller, action);
  });
  this.__router.define(function(method, path, handler) {
    app[method](path, handler);
  });
  this.__router.assist(function(name, entry) {
    if (typeof entry == 'string') {
      self.helper(name + 'Path', patternHelper.path(entry));
      self.dynamicHelper(name + 'URL', patternHelper.url(entry, name));
      return;
    }
    
    var placeholders = [];
    entry.keys.forEach(function(key) {
      if (!key.optional) { placeholders.push(key.name); }
    });
    self.helper(name + 'Path', entryHelper(entry.controller, entry.action, placeholders, true));
    self.helper(name + 'URL', entryHelper(entry.controller, entry.action, placeholders));
  });
  
  // Forward function calls from Locomotive to Express.  This allows Locomotive
  // to be used interchangably with Express.
  utils.forward(this, app, [ 'configure',
                             'get', 'set',
                             'enabled', 'disabled',
                             'enable', 'disable',
                             'use', 'engine' ]);
  this.express = app;
  this.router = app.router;
  this.locals = app.locals;
  this.mime = express.mime;
  
  // Set the environment.  This syncs Express with the environment supplied to
  // the Locomotive CLI.
  this.set('env', env);
};
