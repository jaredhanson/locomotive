/**
 * Module dependencies.
 */
var inflect = require('./inflect')
  , util = require('util')
  , Route = require('./route')
  , RouterError = require('./errors').RouterError;


/**
 * `Router` constructor.
 *
 * @api private
 */
function Router(app) {
  this._app = app;
  this._routes = {};
}

/**
 * Initialize `Router`.
 *
 * Options:
 *   - `handle`  override default handler function factory
 * 
 * @param {express.HTTPServer|express.HTTPSServer} http
 * @param {Object} options
 * @api private
 */
Router.prototype.init = function(http, options) {
  options = options || {};
  
  // Save instance of low-level Express HTTP server.  Routes drawn through
  // Locomotive's router will be compiled into Express routes.
  this._express =
  this._http = http;
  
  this._handle = options.handle || handle;
}

/**
 * Draw routes.
 *
 * Executes `fn` in the context of the `Router` instance.
 *
 * @param {Function} fn
 * @api private
 */
Router.prototype.draw = function(fn) {
  fn.apply(this);
}

/**
 * Create a route for the root ('/') resource.
 *
 * For options, see `match()`, as `root()` invokes it internally.
 * 
 * Examples:
 *
 *     this.root('pages#main');
 *
 * @param {String|Object} shorthand
 * @param {Object} options
 * @api public
 */
Router.prototype.root = function(shorthand, options) {
  this.match('', shorthand, options);
}

/**
 * Create a route matching `pattern`.
 *
 * If an `as` options is specified, routing helper functions will be generated
 * that construct paths and URLs.  For example, given the following route:
 *
 *    this.match('bands', 'bands#index', { as: 'bands' });
 *
 * the following routing helpers will be available within views:
 *
 *    bandsPath() 
 *    // => "/bands"
 *    bandsPath(101)
 *    // => "/bands/101"
 *    bandsPath('counting-crows')
 *    // => "/bands/counting-crows"
 *    bandsPath(obj) -> '/bands'
 *    // => "/bands/123-OBJ-ID"
 *    bandsURL() -> '/bands'
 *    // => "http://www.example.com/bands"
 *
 * Options:
 *
 *  - 'controller'  the route's controller
 *  - 'action'      the route's action
 *  - `as`          generate routing helpers using name
 *  - `via`         allowed HTTP method for route
 * 
 * Examples:
 *
 *     this.match('songs/:title', 'songs#show');
 *
 *     this.match('songs/:title', { controller: 'songs', action: 'show' });
 *
 *     this.match('bands', 'bands#create', { via: 'post' });
 *
 * @param {String} pattern
 * @param {String|Object} shorthand
 * @param {Object} options
 * @api public
 */
Router.prototype.match = function(pattern, shorthand, options) {
  if (!options && typeof shorthand === 'object') {
    options = shorthand;
  }
  if (typeof shorthand === 'string') {
    var split = shorthand.split('#');
    options = options || {};
    options.controller = split[0];
    options.action = split[1];
  }
  
  var controller = inflect._controllerize(options.controller);
  // TODO: action arguments should be camelize()'d
  var action = options.action;
  var method = options.via || 'get';
  
  // TODO: Support declaring a route to a Connect-compatible middleware function.
  // TODO: Support an array of methods given in the via option.
  
  var path = (pattern[0] === '/') ? pattern : '/' + pattern;
  this._route(method, path, controller, action);
  
  if (options.as) {
    var helper = options.as;
    var helpers = {};
    helpers[helper + 'Path'] = pathHelper(controller, action);
    var dynamicHelpers = {};
    dynamicHelpers[helper + 'URL'] = urlHelper(controller, action);
    
    this._express.helpers(helpers);
    this._express.dynamicHelpers(dynamicHelpers);
  }
}

/**
 * Create RESTful routes for singleton resource `name`.
 *
 * A RESTful route provides a mapping between HTTP URLs and methods and
 * corresponding controller functions.  By convention, controller actions map
 * to CRUD operations in a database.
 *
 * The singleton variation of a RESTful route is useful for resources which are
 * referenced without an ID, such as /profile.
 *
 * A single entry in the route configuration, such as:
 *
 *     this.resource('profile');
 *
 * creates six different routes in the application, executed by
 * `ProfileController` (note that the controller is singular).
 *
 *     GET     /profile/new
 *     POST    /profile
 *     GET     /profile
 *     GET     /profile/edit
 *     PUT     /profile
 *     DELETE  /profile
 * 
 * Examples:
 *
 *     this.resource('profile');
 *
 * @param {String} name
 * @api public
 */
Router.prototype.resource = function(name) {
  var controller = inflect._controllerize(name);
  
  // TODO: Ensure that optional format parameters are available and handled
  //       correctly.
  // TODO: Generate named routing helpers.
  
  var path = '/' + name;
  this._route('get' , path + '/new'     , controller, 'new');
  this._route('post', path              , controller, 'create');
  this._route('get' , path + '.:format?', controller, 'show');
  this._route('get' , path + '/edit'    , controller, 'edit');
  this._route('put' , path              , controller, 'update');
  this._route('del' , path              , controller, 'destroy');
}

/**
 * Create RESTful routes for resource `name`.
 *
 * A RESTful route provides a mapping between HTTP URLs and methods and
 * corresponding controller functions.  By convention, controller actions map
 * to CRUD operations in a database.
 *
 * A single entry in the route configuration, such as:
 *
 *     this.resources('photos');
 *
 * creates seven different routes in the application, executed by
 * `PhotosController`.
 *
 *     GET     /photos
 *     GET     /photos/new
 *     POST    /photos
 *     GET     /photos/:id
 *     GET     /photos/:id/edit
 *     PUT     /photos/:id
 *     DELETE  /photos/:id
 * 
 * Examples:
 *
 *     this.resources('photos');
 *
 * @param {String} name
 * @api public
 */
Router.prototype.resources = function(name) {
  var controller = inflect._controllerize(name);
  
  // TODO: Ensure that optional format parameters are available and handled
  //       correctly.
  // TODO: Generate named routing helpers.
  
  var path = '/' + name;
  this._route('get' , path                   , controller, 'index');
  this._route('get' , path + '/new'          , controller, 'new');
  this._route('post', path                   , controller, 'create');
  this._route('get' , path + '/:id.:format?' , controller, 'show');
  this._route('get' , path + '/:id/edit'     , controller, 'edit');
  this._route('put' , path + '/:id'          , controller, 'update');
  this._route('del' , path + '/:id'          , controller, 'destroy');
}

/**
 * Create route from `method` and `pattern` to `controller` and `action`.
 * 
 * @param {String} method
 * @param {String} pattern
 * @param {String} controller
 * @param {String} action
 * @api private
 */
Router.prototype._route = function(method, pattern, controller, action) {
  var key = controller + '#' + action;
  if (!this._routes[key]) {
    this._routes[key] = new Route(method, pattern)
  }
  
  this._http[method](pattern, this._handle(controller, action).bind(this._app));
}

/**
 * Find route to `controller` and `action`.
 * 
 * @param {String} controller
 * @param {String} action
 * @return {Route}
 * @api protected
 */
Router.prototype._find = function(controller, action) {
  var key = controller + '#' + action;
  return this._routes[key];
}


/**
 * Builds a function to handle a route with given `controller` and `action`.
 *
 * @param {String} controller
 * @param {String} action
 * @return {Function}
 * @api private
 */
function handle(controller, action) {
  
  return function(req, res, next){
    var prototype = this.controller(controller);
    if (!prototype) {
      return next(new RouterError('No controller for ' + controller + '#' + action));
    }
    
    // Create a new instance of the controller from the prototype.  The
    // prototype acts as a "factory" from which an instance is created for each
    // request.  This allows request-specific properties to be assigned to each
    // instance, without causing conflicts due to concurrency.
    var instance = Object.create(prototype);
    instance._prepare(req, res, next);
    instance._invoke(action);
  }
}

/**
 * Builds a path routing helper function for `path`.
 *
 * @param {String} controller
 * @param {String} action
 * @return {Function}
 * @api private
 */
function pathHelper(controller, action) {

  return function(obj) {
    var options = { controller: controller, action: action, onlyPath: true };
    if (obj && obj.id) {
      options.id = obj.id;
    } else if (obj) {
      options.id = obj;
    }
    
    return this.urlFor(options);
  }
}

/**
 * Builds a URL routing helper function for `path`.
 *
 * @param {String} controller
 * @param {String} action
 * @return {Function}
 * @api private
 */
function urlHelper(controller, action) {

  return function(req, res) {
    return function(obj) {
      var options = { controller: controller, action: action };
      if (obj && obj.id) {
        options.id = obj.id;
      } else if (obj) {
        options.id = obj;
      }
      
      return this.urlFor(options);
    }
  }
}


/**
 * Expose `Router`.
 */
exports = module.exports = Router;
