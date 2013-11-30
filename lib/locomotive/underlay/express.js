var http = require('http')
  , express = require('express')
  , utils = require('../utils')
  , dispatch = require('../middleware/dispatch')
  , routeHelper = require('../helpers/route');


module.exports = function(env) {
  var self = this
    , app = express()
    , server = http.createServer(app)
    , env = env || process.env.NODE_ENV || 'development';
  
  this.__router.handler(function(controller, action) {
    return dispatch(self, controller, action);
  });
  this.__router.define(function(method, path, handler) {
    app[method](path, handler);
  });
  this.__router.assist(function(name, entry) {
    var placeholders = [];
    entry.keys.forEach(function(key) {
      if (!key.optional) { placeholders.push(key.name); }
    });
    
    self.helper(name + 'Path', routeHelper(entry.controller, entry.action, placeholders, true));
    self.helper(name + 'URL', routeHelper(entry.controller, entry.action, placeholders));
  });
  
  // Forward function calls from Locomotive to Express.  This allows Locomotive
  // to be used interchangably with Express.
  utils.forward(this, app, [ 'configure', 'get', 'set', 'enabled', 'disabled', 'enable', 'disable',
                             'use', 'engine' ]);
  this.express = app;
  this.router = app.router;
  this.mime = express.mime;
  // TODO: No need to create or expose server
  this.server = server;
  
  // Set the environment.  This syncs Express with the environment supplied to
  // the Locomotive CLI.
  this.set('env', env);

  // Setup Locals
  this.locals = app.locals;
}
