var http = require('http')
  , express = require('express')
  , utils = require('../utils')
  , Router = require('actionrouter').Router;


module.exports = function(options) {
  console.log('UNDERLAY EXPRESS...');
  
  var self = this
    , app = express()
    , server = http.createServer(app)
    , env = options.env || process.env.NODE_ENV || 'development';
  
  //this._routes.init(app);
  this._routes = new Router(function(controller, action) {
    return require('../middleware/handle')(self, controller, action);
  });
  this._routes.define(function(method, path, handler) {
    app[method](path, handler);
  });
  this._routes.assist(function(name, entry) {
    var placeholders = [];
    entry.keys.forEach(function(key) {
      if (!key.optional) { placeholders.push(key.name); }
    });
    
    self.helper(name + 'Path', routeHelper(entry.controller, entry.action, placeholders, true));
    self.dynamicHelper(name + 'URL', function(req, res) {
      return routeHelper(entry.controller, entry.action, placeholders);
    });
  });
  
  // Forward function calls from Locomotive to Express.  This allows Locomotive
  // to be used interchangably with Express.
  utils.forward(this, app, [ 'configure', 'get', 'set', 'enabled', 'disabled', 'enable', 'disable',
                             'use', 'engine' ]);
  this.express = app;
  this.router = app.router;
  this.mime = express.mime;
  this.server = server;
  
  // Set the environment.  This syncs Express with the environment supplied to
  // the Locomotive CLI.
  this.env = env;
  this.set('env', env);

  // Setup Locals
  this.locals = app.locals;
}


// TODO: Refactor this (copied from route.js)
function routeHelper(controller, action, placeholders, onlyPath) {

  return function(obj) {
    if (arguments.length !== placeholders.length) { throw new Error('Incorrect number of arguments for route helper to ' + controller + '#' + action); }
    
    var options = { controller: controller, action: action, onlyPath: onlyPath };    
    for (var i = 0, len = arguments.length; i < len; i++) {
      var arg = arguments[i];
      var placeholder = placeholders[i];
    
      if (arg && arg.id) {
        options[placeholder] = arg.id;
      } else if (arg) {
        options[placeholder] = arg;
      }
    }
    return this.urlFor(options);
  }
}
