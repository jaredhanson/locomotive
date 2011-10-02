/**
 * Module dependencies.
 */
var express = require('express')
  , fs = require('fs')
  , path = require('path')
  , util = require('util')
  , Router = require('./router')
  , Controller = require('./controller');


function Locomotive() {
  var self = this;
  this.routes = new Router(this);
  this._controllers = {};
};

Locomotive.prototype.init = function(app) {
  app = app || express.createServer();
  
  // Bind Locomotive to Express' settings functions
  this.set = app.set.bind(app);
  
  this.routes.init(app);
  this._express = app;
  this._configure();
  return this._express;
}

Locomotive.prototype.controller = function(name, controller) {
  // Record the controller in an internal hash.
  if (controller) {
    controller._name = name;
    this._controllers[name + 'Controller'] = controller;
  }
  return this._controllers[name];
}

Locomotive.prototype._configure = function() {
  var configDir = this.set('config') || process.cwd() + '/config';
  
  // TODO: Catch errors if initializer directory doesn't exist
  // Require initializers
  fs.readdirSync(configDir + '/initializers').forEach(function(filename) {
    if (/\.js$/.test(filename)) {
      require(configDir + '/initializers/' + filename);
    }
  });
  
  // Apply configuration for all environments
  var configPath = configDir + '/environments/all.js';
  if (path.existsSync(configPath)) {
    require(configPath).apply(this._express);
  }
  // Apply configuration for current environment
  configPath = configDir + '/environments/' + this.set('env') + '.js';
  if (path.existsSync(configPath)) {
    require(configPath).apply(this._express);
  }
  
  // Draw routes
  var routesPath = configDir + '/routes.js';
  if (path.existsSync(routesPath)) {
    this.routes.draw(require(routesPath));
  }
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
exports.version = '0.1.0';

/**
 * Expose constructors.
 */
exports.Controller = Controller;
