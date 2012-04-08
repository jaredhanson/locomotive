/**
 * Module dependencies.
 */
var express = require('express')
  , path = require('path')
  , fs = require('fs')
  , diveSync = require('diveSync')
  , async = require('async')
  , util = require('util')
  , utils = require('./utils')
  , Router = require('./router')
  , Controller = require('./controller')
  , debug = require('debug')('locomotive');


/**
 * `Locomotive` constructor.
 *
 * A default `Locomotive` singleton is exported via the module.  Applications
 * should not need to construct additional instances, and are advised against
 * doing so.
 *
 * @api public
 */
function Locomotive() {
  this._routes = new Router(this);
  this._controllers = {};
  this._helpers = {};
  this._dynamicHelpers = {};
  this._datastores = [];
};

/**
 * Register `controller` with given `name`, or return `name`'s controller. 
 *
 * @param {String} name
 * @param {Controller} controller
 * @return {Controller|Locomotive} for chaining, or the controller
 * @api public
 */
Locomotive.prototype.controller = function(name, controller) {
  name = utils.controllerize(name);
  // record the controller in an internal hash.
  if (controller) {
    controller._load(this, name);
    this._controllers[name] = controller;
    return this;
  }
  return this._controllers[name];
}

/**
 * Register helper function(s).
 *
 * Helper functions can be registered by passing an object as an argument, in
 * which case each function of that object will be registered as a helper.  As
 * a convienience, if the object contains a property named `dynamic`, each
 * function attached to that property will be registered as a dynamic helper.
 *
 * Helper functions can also be registered by passing a `name`, which `fn` will
 * be registered as.
 *
 * @param {String|Object} obj
 * @param {Function} fn
 * @api public
 */
Locomotive.prototype.helper =
Locomotive.prototype.helpers = function(name, fn) {
  var helpers = name;
  if (fn) {
    helpers = {};
    helpers[name] = fn;
  }
  
  for (var key in helpers) {
    if (key === 'dynamic') {
      this.dynamicHelpers(helpers[key]);
    } else {
      this._helpers[key] = helpers[key];
    }
  }
  return this;
}

/**
 * Register dynamic helper function(s).
 *
 * Helper functions can be registered by passing an object as an argument, in
 * which case each function of that object will be registered as a helper.
 *
 * Helper functions can also be registered by passing a `name`, which `fn` will
 * be registered as.
 *
 * @param {String|Object} obj
 * @param {Function} fn
 * @api public
 */
Locomotive.prototype.dynamicHelper =
Locomotive.prototype.dynamicHelpers = function(name, fn) {
  var helpers = name;
  if (fn) {
    helpers = {};
    helpers[name] = fn;
  }
  
  for (var key in helpers) {
    this._dynamicHelpers[key] = helpers[key];
  }
  return this;
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
 * Boot `Locomotive` application.
 *
 * Locomotive builds on Express, providing a set of conventions for how to
 * organize code and resources on the file system as well as an MVC architecture
 * for structuring code.
 *
 * When booting a Locomotive application, the file system conventions are used
 * to initialize modules, configure the environment, register controllers, and
 * draw routes.  When complete, `callback` is invoked with an initialized
 * `express` instance that can listen for requests or be mounted in a larger
 * application.
 *
 * @param {String} dir
 * @param {String} env
 * @param {Object} options
 * @param {Function} callback
 * @api public
 */
Locomotive.prototype.boot = function(dir, env, options, callback) {
  if (typeof options == 'function') {
    callback = options;
    options = {};
  }
  options = options || {};
  options.appDir = options.appDir || path.resolve(dir, './app');
  options.controllersDir = options.controllersDir || path.resolve(options.appDir, './controllers');
  options.configDir = options.configDir || path.resolve(dir, './config');
  options.initializersDir = options.initializersDir || path.resolve(options.configDir, './initializers');
  options.environmentsDir = options.environmentsDir || path.resolve(options.configDir, './environments');
  options.routesFile = options.routesFile || path.resolve(options.configDir, './routes.js');
  
  var self = this
    , server = express.createServer()
    , entry;
  
  this._routes.init(server);
  
  this.helpers(require('./helpers'));
  this.dynamicHelpers(require('./helpers/dynamic'));
  
  // Forward function calls from Locomotive to Express.  This allows Locomotive
  // to be used interchangably with Express.
  utils.forward(this, server, [ 'set', 'enabled', 'disabled', 'enable', 'disable',
                                'use', 'register' ]);
  this.router = server.router;
  
  // Set the environment.  This syncs Express with the environment supplied to
  // the Locomotive CLI.
  this.env = env;
  this.set('env', env);
  
  
  function initialize(done) {
    var dir = options.initializersDir;
    if (!path.existsSync(dir)) { return next(); }
    
    // NOTE: Sorting is required, due to the fact that no order is guaranteed
    //       by the system for a directory listing.  Sorting allows initializers
    //       to be prefixed with a number, and loaded in a pre-determined order.
    var files = fs.readdirSync(dir).sort();
    async.forEachSeries(files, function(file, next) {
      if (/\.js$/.test(file)) {
        debug('requiring initializer: %s', file);
        var mod = require(path.join(dir, file));
        if (typeof mod == 'function') {
          // Async initializer.  Exported function will be invoked, with next
          // being called when the initializer finishes.
          mod.call(self, next);
        } else {
          // Non-async initializer.  Requiring the initializer is sufficient to
          // invoke it, next immediately.
          next();
        }
      } else {
        next();
      }
    }, function(err) {
      done(err);
    });
  }
  
  function configure(done) {
    var dir = options.environmentsDir;
    var file;
    
    // configuration for all environments
    file = path.join(dir, 'all.js');
    if (path.existsSync(file)) {
      debug('configuring environment: %s', 'all');
      require(file).apply(self);
    }
    // configuration for current environment
    file = path.join(dir, env + '.js');
    if (path.existsSync(file)) {
      debug('configuring environment: %s', env);
      require(file).apply(self);
    }
    done();
  }
  
  function defaults(done) {
    // Register the default, object-based datastore.  This is done after
    // configuration to give the application an opportunity to register its own
    // datastores, which take priority over this fallback.
    self.datastore(require('./datastores/object'));
    done();
  }
  
  function controllers(done) {
    var dir = options.controllersDir;
    if (!path.existsSync(dir)) { return next(); }

    diveSync(dir, function(err, path) {
      if (/\.js$/.test(path)) {
        var name = path.slice(dir.length + 1).replace(/\.js$/, '');
        debug('registering controller: %s', name)
        self.controller(name, require(path));
      }
    });
    done();
  }
  
  function routes(done) {
    var file = options.routesFile;
    if (path.existsSync(file)) {
      debug('drawing routes')
      self._routes.draw(require(file));
    }
    done();
  }
  
  
  async.series([
      initialize,
      configure,
      defaults,
      controllers,
      routes
    ],
    function(err, results) {
      if (err) { return callback(err); }
      callback(null, server);
    }
  );
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
require('pkginfo')(module, 'version');

/**
 * Expose constructors.
 */
exports.Locomotive = Locomotive;
exports.Controller = Controller;

/**
 * Expose CLI.
 *
 * @api private
 */
exports.cli = require('./cli');
