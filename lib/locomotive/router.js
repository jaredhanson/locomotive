/**
 * Module dependencies.
 */
var inflect = require('./inflect')
  , util = require('util')
  , RouterError = require('./errors').RouterError;


/**
 * `Router` constructor.
 *
 * @api private
 */
function Router(app) {
  this._app = app;
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
 * For options, see `match()` as `root()` invokes it internally.
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
  var action = options.action;
  var method = options.via || 'get';
  
  // TODO: Support declaring a route to a Connect-compatible middleware function.
  // TODO: Support an array of methods given in the via option.
  
  var path = (pattern[0] === '/') ? pattern : '/' + pattern;
  this._http[method](path, this._handle(controller, action).bind(this._app));
  
  if (options.as) {
    var helper = options.as;
    var helpers = {};
    helpers[helper + 'Path'] = pathHelper(path).bind(this._app);
    var dynamicHelpers = {};
    dynamicHelpers[helper + 'URL'] = urlHelper(path).bind(this._app);
    
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
  
  var path = '/' + name;
  this._http.get  (path + '/new'    , this._handle(controller, 'new').bind(this._app));
  this._http.post (path             , this._handle(controller, 'create').bind(this._app));
  this._http.get  (path + ':format?', this._handle(controller, 'show').bind(this._app));
  this._http.get  (path + '/edit'   , this._handle(controller, 'edit').bind(this._app));
  this._http.put  (path             , this._handle(controller, 'update').bind(this._app));
  this._http.del  (path             , this._handle(controller, 'destroy').bind(this._app));
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
  
  var path = '/' + name;
  this._http.get  (path                   , this._handle(controller, 'index').bind(this._app));
  this._http.get  (path + '/new'          , this._handle(controller, 'new').bind(this._app));
  this._http.post (path                   , this._handle(controller, 'create').bind(this._app));
  this._http.get  (path + '/:id.:format?' , this._handle(controller, 'show').bind(this._app));
  this._http.get  (path + '/:id/edit'     , this._handle(controller, 'edit').bind(this._app));
  this._http.put  (path + '/:id'          , this._handle(controller, 'update').bind(this._app));
  this._http.del  (path + '/:id'          , this._handle(controller, 'destroy').bind(this._app));
}


/**
 * Builds a function to handle a route with given `controller` and `action`.
 *
 * @param {String} controller
 * @param {String} action
 * @return {Function}
 * @api private
 */
function handle(controller, action, options) {
  
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
 * @param {String} path
 * @return {Function}
 * @api private
 */
function pathHelper(path) {

  return function(obj) {
    var suffix = undefined;
    if (typeof obj === 'string') { suffix = obj }
    else if (typeof obj === 'number') { suffix = obj }
    else if (obj && obj.id) { suffix = obj.id }
    
    return suffix ? path + '/' + suffix : path;
  }
}

/**
 * Builds a URL routing helper function for `path`.
 *
 * @param {String} path
 * @return {Function}
 * @api private
 */
function urlHelper(path) {

  return function(req, res) {
    return function(obj) {
      // TODO: Inspect req for host header, from which an absolute URL can be
      //       constructed.
      // TODO: Add a separate 'url root' setting to override (?)
      
      var suffix = undefined;
      if (typeof obj === 'string') { suffix = obj }
      else if (typeof obj === 'number') { suffix = obj }
      else if (obj && obj.id) { suffix = obj.id }

      var url = path;
      if (suffix) { url = url + '/' + suffix; }
      return url;
    }
  }
}


/**
 * Expose `Router`.
 */
exports = module.exports = Router;
