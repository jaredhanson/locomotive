/**
 * Module dependencies.
 */
var express = require('express')
  , path = require('path')
  , fs = require('fs')
  , existsSync = fs.existsSync || path.existsSync // 0.6 compat
  , diveSync = require('diveSync')
  , async = require('async')
  , util = require('util')
  , utils = require('./utils')
  , Router = require('./router')
  , Controller = require('./controller')
  , invoke = require('./middleware/invoke')
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
  this._formats = {};
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
    if (!controller._load) { console.warn('invalid controller: %s', name); return; }
    controller._load(this, name);
    this._controllers[name] = controller;
    return this;
  }
  return this._controllers[name];
}

/**
 * Register rendering `options` for format `fmt`.
 *
 * Locomotive provides support for content negotiation, allowing a single route
 * to respond with multiple formats.  For example, a route handler might respond
 * with JSON or XML for API requests, and HTML for requests from a browser.
 * `Controller.respond()` is used to respond according to the aceptable types
 * indicated by the client.
 *
 * Rather than specifying the engine used to render the response as an option to
 * each `render` or `respond` invocation, the engine can be specified once as
 * an application-level option (typically in `environments/all.js`).
 *
 *     this.format('xml', { engine: 'xmlb' })
 *
 * The above specifies that [xmlb](https://github.com/jaredhanson/xmlb) is used
 * as the template engine for XML formatted responses.
 *
 *     this.render('atom', { format: 'xml' });
 *     //=> renders `atom.xml.xmlb`
 *
 * By default, Locomotive looks for template files using a convention of
 * name.format.engine.  If this convention is not natural for the template
 * engine being used, it can be overridden by registering an extension for the
 * format.
 *
 * For example, [Jade](http://jade-lang.com/) is a popular template engine.
 * Jade expects layouts to end with `.jade`.  Using template names of
 * `action.html.jade` results in mixed conventions that can cause confusion.
 * When this happens, map an explicit extension to the format.
 *
 *     this.format('html', { extension: '.jade' })
 *
 * Now, rendering will use the mapped extension instead of the `.format.engine`
 * convention.
 *
 *     this.render('show');
 *     //=> renders `show.jade`
 *
 * @param {String} fmt
 * @param {Object} options
 * @return {Locomotive} for chaining
 * @api public
 */
Locomotive.prototype.format = function(fmt, options) {
  fmt = utils.extensionizeType(fmt);
  if (typeof options == 'string') {
    options = { engine: options }
  }
  this._formats[fmt] = options;
  return this;
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
 * Middleware that will extend `req` with an `invoke()` function.
 *
 * Once `invoke()` is exposed on a request, it can be called in order to invoke
 * a specific controller and action in this Locomotive appliction.  This is
 * typically done to call into a Locmotive application from middleware or routes
 * that exist outside of the application itself.
 *
 * To use this middleware, place the following line in `config/environments/all.js`:
 *
 *     this.use(locomotive.invoke());
 *
 * If you are mounting multiple Locomotive applications in a single server, a
 * `name` option can be passed, in order to avoid collisions when extending the
 * request multiple times.
 *
 *     this.use(locomotive.invoke({ name: 'invokeApp1' }));
 *
 * @param {Object} options
 * @return {Function} middleware
 * @api public
 */
Locomotive.prototype.invoke = function(options) {
  return invoke(options).bind(this);
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
  
  if (!existsSync(dir)) { return callback(new Error('Application does not exist: ' + dir)); }
  options.controllersDir = options.controllersDir || path.resolve(dir, './app/controllers');
  options.environmentsDir = options.environmentsDir || path.resolve(dir, './config/environments');
  options.initializersDir = options.initializersDir || path.resolve(dir, './config/initializers');
  options.routesFile = options.routesFile || path.resolve(dir, './config/routes.js');
  
  var self = this
    , app = express()
    , exts = [ 'js' ];
    
  if (options.coffee || options.coffeeScript) {
    debug('enabled CoffeeScript');
    exts.push('coffee')
  }
  
  
  this._routes.init(app);
  
  // Forward function calls from Locomotive to Express.  This allows Locomotive
  // to be used interchangably with Express.
  utils.forward(this, app, [ 'configure', 'get', 'set', 'enabled', 'disabled', 'enable', 'disable',
                             'use', 'engine', 'locals' ]);
  this.express = app;
  this.router = app.router;
  this.mime = express.mime;
  
  this.helpers(require('./helpers'));
  this.dynamicHelpers(require('./helpers/dynamic'));
  
  // Set the environment.  This syncs Express with the environment supplied to
  // the Locomotive CLI.
  this.env = env;
  this.set('env', env);

  function environments(done) {
    var dir = options.environmentsDir
      , file;
    
    // configuration for all environments
    file = utils.resolveExt(dir, 'all', exts);
    if (existsSync(file)) {
      debug('configuring environment: %s', 'all');
      require(file).apply(self);
    }
    // configuration for current environment
    file = utils.resolveExt(dir, env, exts);
    if (existsSync(file)) {
      debug('configuring environment: %s', env);
      require(file).apply(self);
    }
    done();
  }
  
  function initializers(done) {
    var dir = options.initializersDir;
    if (!existsSync(dir)) { return done(); }
    
    // NOTE: Sorting is required, due to the fact that no order is guaranteed
    //       by the system for a directory listing.  Sorting allows initializers
    //       to be prefixed with a number, and loaded in a pre-determined order.
    var files = fs.readdirSync(dir).sort();
    async.forEachSeries(files, function(file, next) {
      var regex = new RegExp('\\.(' + exts.join('|') + ')$');
      if (regex.test(file)) {
        debug('requiring initializer: %s', file);
        var mod = require(path.join(dir, file));
        if (typeof mod == 'function') {
          var arity = mod.length;
          if (arity == 1) {
            // Async initializer.  Exported function will be invoked, with next
            // being called when the initializer finishes.
            mod.call(self, next);
          } else {
            // Sync initializer.  Exported function will be invoked, with next
            // being called immediately.
            mod.call(self);
            next();
          }
        } else {
          // Initializer does not export a function.  Requiring the initializer
          // is sufficient to invoke it, next immediately.
          next();
        }
      } else {
        next();
      }
    }, function(err) {
      done(err);
    });
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
    if (!existsSync(dir)) { return done(); }

    var ex;
    diveSync(dir, function(err, path) {
      if (ex) { return; }
      var regex = new RegExp('\\.(' + exts.join('|') + ')$');
      if (regex.test(path)) {
        var name = path.slice(dir.length + 1).replace(regex, '');
        debug('registering controller: %s', name)
        try {
          self.controller(name, require(path));
        } catch(e) {
          ex = e;
        }
      }
    });
    done(ex);
  }
  
  function routes(done) {
    var file = options.routesFile;
    if (!existsSync(file)) {
      file = utils.resolveAltExt(file, exts);
    }
    if (existsSync(file)) {
      debug('drawing routes');
      self._routes.draw(require(file));
    }
    done();
  }
  
  // Boot the application by configuring the environment, invoking
  // initializers, loading controllers, and drawing routes.
  async.series([
      environments,
      initializers,
      defaults,
      controllers,
      routes
    ],
    function(err, results) {
      if (err) { return callback(err); }
      callback(null, app);
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
