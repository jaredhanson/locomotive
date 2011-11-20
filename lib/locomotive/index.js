/**
 * Module dependencies.
 */
var express = require('express')
  , fs = require('fs')
  , path = require('path')
  , inflect = require('./inflect')
  , util = require('util')
  , Router = require('./router')
  , Controller = require('./controller');


/**
 * `Locomotive` constructor.
 *
 * Locomotive will use the default singleton and perform the necessary
 * operations to boot an application.
 *
 * @api protected
 */
function Locomotive() {
  this._routes = new Router(this);
  this._controllers = {};
  this._datastores = [];
};

/**
 * Intialize `Locomotive`.
 *
 * Intialize a Locomotive-based application with the given Express `server`, or
 * create a server if one is not provided.  The conventional directory structure
 * will then be used to boot the application, including configuring environments,
 * drawing routes, etc.
 *
 * @param {express.HTTPServer|express.HTTPSServer} app
 * @return {express.HTTPServer|express.HTTPSServer}
 * @api protected
 */
Locomotive.prototype.init = function(server) {
  server = server || express.createServer();
  
  // Bind Locomotive to Express' settings functions
  this.configure = server.configure.bind(server);
  this.set = server.set.bind(server);
  this.enabled = server.enabled.bind(server);
  this.disabled = server.disabled.bind(server);
  this.enable = server.enable.bind(server);
  this.disable = server.disable.bind(server);
  
  // Bind Locomotive to Express' routing functions
  this.router = server.router.bind(server);
  this.use = server.use.bind(server);
  
  // TODO: Determine the best mechanism to expose helpers.
  server.helpers(require('./helpers'));
  server.dynamicHelpers(require('./helpers/dynamic'));
  
  this._routes.init(server);
  this._configure();
  return server;
}

/**
 * Register `controller` with given `name`, or return `name`'s controller. 
 *
 * @param {String} name
 * @param {Controller} controller
 * @return {Controller|Locomotive} for chaining, or the controller
 * @api protected
 */
Locomotive.prototype.controller = function(name, controller) {
  name = inflect._controllerize(name);
  // record the controller in an internal hash.
  if (controller) {
    controller._init(this, name);
    this._controllers[name] = controller;
    return this;
  }
  return this._controllers[name];
}

/**
 * Register datastore `store`.
 *
 * To facilitate mapping models to controllers, Locomotive introspects models
 * in order to determine their type.  By default, the constructor name is used;
 * for example, an instance of `Song` maps to `SongsController`.  However, most
 * datastores have APIs that don't conform to this (admittedly, rather
 * simplistic) heuristic.  To accomodate such datastores, adapters can and
 * should be registered with Locomotive to provide the necessary introspection
 * logic.
 *
 * @param {Module} store
 * @api public
 */
Locomotive.prototype.datastore = function(store) {
  this._datastores.push(store);
}

/**
 * Returns a string indicating the type of record of `obj`.
 * 
 * @param {Object} obj
 * @return {String}
 * @api protected
 */
Locomotive.prototype._recordOf = function(obj) {
  for (var i = 0, len = this._datastores.length; i < len; i++) {
    var ds = this._datastores[i];
    var kind = ds.recordOf(obj);
    if (kind) { return kind; }
  }
  return undefined;
}


/**
 * Configure `Locomotive`.
 *
 * @api protected
 */
Locomotive.prototype._configure = function() {
  var self = this;
  var configDir = this.set('config') || process.cwd() + '/config';
  var configPath;
  
  // Require initializers
  configPath = configDir + '/initializers';
  if (path.existsSync(configPath)) {
    fs.readdirSync(configPath).forEach(function(filename) {
      if (/\.js$/.test(filename)) {
        require(configPath + '/' + filename);
      }
    });
  }
  
  // Apply configuration for all environments
  configPath = configDir + '/environments/all.js';
  if (path.existsSync(configPath)) {
    require(configPath).apply(this);
  }
  // Apply configuration for current environment
  configPath = configDir + '/environments/' + this.set('env') + '.js';
  if (path.existsSync(configPath)) {
    require(configPath).apply(this);
  }
  
  // Draw routes
  var routesPath = configDir + '/routes.js';
  if (path.existsSync(routesPath)) {
    this._routes.draw(require(routesPath));
  }
  
  
  var appDir = this.set('app') || process.cwd() + '/app';
  var appPath;
  
  // TODO: Correctly load and namespace controllers loaded from subdirectories (ex: /admin)
  
  // Auto-load controllers
  appPath = appDir + '/controllers';
  if (path.existsSync(appPath)) {
    fs.readdirSync(appPath).forEach(function(filename) {
      if (/\.js$/.test(filename)) {
        var name = filename.replace(/\.js$/, '');
        self.controller(name, require(appPath + '/' + filename));
      }
    });
  }
  
  this.datastore(require('./datastores/object'));
}


/**
 * Export default singleton.
 *
 * @api public
 */
exports = module.exports = new Locomotive();

/**
 * Framework version.
 */
exports.version = '0.1.1';

/**
 * Expose constructors.
 */
exports.Locomotive = Locomotive;
exports.Controller = Controller;
