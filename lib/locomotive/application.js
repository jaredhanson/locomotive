/**
 * Module dependencies.
 */
var fs = require('fs')
  , bootable = require('bootable')
  , Router = require('actionrouter').Router
  , Resolver = require('./resolver')
  , Instantiator = require('./instantiator')
  , DispatchError = require('./errors/dispatcherror')
  , utils = require('./utils')
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
function Application() {
  this.__router = new Router();
  this.__initializer = new bootable.Initializer();
  this.__controllers = {};
  this._formats = {};
  this._helpers = {};
  this._dynamicHelpers = {};
  this.__datastores = [];
  
  this.__controllerResolver = new Resolver();
  this.__controllerInstantiator = new Instantiator();
  this.__viewResolver = new Resolver();
  
  // Sugary API
  this.controllers = {};
  this.controllers.resolve = { use: this.__controllerResolver.use.bind(this.__controllerResolver) };
  this.controllers.instantiate = { use: this.__controllerInstantiator.use.bind(this.__controllerInstantiator) };

  this.views = {};
  this.views.resolve = this.__viewResolver.resolve.bind(this.__viewResolver);
  this.views.resolve.use = this.__viewResolver.use.bind(this.__viewResolver);
}

/**
 * Initialize application.
 *
 * @api private
 */
Application.prototype.init = function(env) {
  env = env || process.env.NODE_ENV || 'development';
  require('./underlay/express').call(this, env);
  
  this.env = env;
  this.helpers(require('./helpers'));
  this.dynamicHelpers(require('./helpers/dynamic'));
};

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
 * When rendering from a controller, the application-level engine option is in
 * effect:
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
Application.prototype.format = function(fmt, options) {
  fmt = utils.extensionizeType(fmt);
  if (typeof options == 'string') {
    options = { engine: options };
  }
  this._formats[fmt] = options;
  return this;
};

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
Application.prototype.helper =
Application.prototype.helpers = function(name, fn) {
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
};

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
Application.prototype.dynamicHelper =
Application.prototype.dynamicHelpers = function(name, fn) {
  var helpers = name;
  if (fn) {
    helpers = {};
    helpers[name] = fn;
  }

  for (var key in helpers) {
    this._dynamicHelpers[key] = helpers[key];
  }
  return this;
};

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
Application.prototype.datastore = function(store) {
  this.__datastores.push(store);
};

/**
 * Register a boot phase.
 *
 * When an application boots, it proceeds through a series of phases, ultimately
 * resulting in a listening server ready to handle requests.
 *
 * A phase can be either synchronous or asynchronous.  Synchronous phases have
 * following function signature
 *
 *     function myPhase() {
 *       // perform initialization
 *     }
 *
 * Asynchronous phases have the following function signature.
 *
 *     function myAsyncPhase(done) {
 *       // perform initialization
 *       done();  // or done(err);
 *     }
 *
 * @param {Function} fn
 * @api public
 */
Application.prototype.phase = function(fn) {
  this.__initializer.phase(fn);
  return this;
};

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
 *     this.use(oneApp.invoke({ name: 'invokeOneApp' }));
 *     this.use(twoApp.invoke({ name: 'invokeTwoApp' }));
 *
 * @param {Object} options
 * @return {Function} middleware
 * @api public
 */
Application.prototype.invokable = function(options) {
  return require('./middleware/invokable')(this, options);
};

/**
 * Instantiate controller with given `id`.
 *
 * Controller's are auto-required by Locomotive.  The value exported by the
 * module is used to construct an instance of the controller, using either a
 * constructor or prototype creation pattern.
 *
 * @param {String} id
 * @param {Function} cb
 * @api protected
 */
Application.prototype._controller = function(id, cb) {
  var mod = this.__controllers[id]
    , mpath;
  
  if (!mod) {
    // No controller module was found in the cache.  Attempt auto-load.
    debug('autoload controller ' + id);
    try {
      mpath = this.__controllerResolver.resolve(id);
    } catch (_) {
      return cb(new DispatchError("Unable to resolve controller '" + id + "'"));
    }
  
    try {
      mod = require(mpath);
    } catch (ex) {
      if (ex instanceof SyntaxError) {
        // Helpful error with file name and line number
        var check = require('syntax-error');
        
        var src = fs.readFileSync(mpath)
          , err = check(src, mpath);
        if (err) { return cb(err); }
      }
      return cb(ex);
    }
    
    // cache the controller module
    this.__controllers[id] = mod;
  }
  
  this.__controllerInstantiator.instantiate(mod, id, function(err, inst) {
    if (err) { return cb(err); }
    return cb(null, inst);
  });
};

/**
 * Find route to given controller action.
 *
 * Locomotive uses an MVC-style router, where routes map from a URL pattern to
 * a controller action, and vice versa.
 *
 * @param {String} controller
 * @param {String} action
 * @return {Entry}
 * @api protected
 */
Application.prototype._routeTo = function(controller, action) {
  return this.__router.find(controller, action);
};

/**
 * Returns a string indicating the type of record of `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api protected
 */
Application.prototype._recordOf = function(obj) {
  for (var i = 0, len = this.__datastores.length; i < len; i++) {
    var ds = this.__datastores[i];
    var kind = ds.recordOf(obj);
    if (kind) { return kind; }
  }
  return undefined;
};

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
Application.prototype.boot = function(env, cb) {
  if (typeof env == 'function') {
    cb = env;
    env = undefined;
  }
  
  this.init(env);
  this.__initializer.run(cb, this);
};


/**
 * Expose `Application`.
 */
module.exports = Application;
