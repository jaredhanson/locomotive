/**
 * Module dependencies.
 */
var inflect = require('./inflect')
  , util = require('util')
  , Namespace = require('./namespace')
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
  this._nesting = [];  // TODO: get rid of nesting
  
  this._ns = [];
  this._ns.push(new Namespace());
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
 * A route that will be handled by `SongsController.show()` can be specified
 * using shorthand notation:
 *
 *     this.match('songs/:title', 'songs#show');
 *
 * which is equivalent to using `controller` and `action` options.
 *
 *     this.match('songs/:title', { controller: 'songs', action: 'show' });
 *
 * If an `as` option is specified, a path and URL routing helper function will
 * be dynamically declared.  For example, given the following route:
 *
 *    this.match('bands/:id', 'bands#show', { as: 'bands' });
 *
 * the following routing helpers will be available to views:
 *
 *    bandsPath(101)
 *    // => "/bands/101"
 *    bandsPath('counting-crows')
 *    // => "/bands/counting-crows"
 *    bandsPath({ id: 'ABC123' })
 *    // => "/bands/ABC123"
 *
 *    bandsURL(101)
 *    // => "http://www.example.com/bands/101"
 *    bandsPath('counting-crows')
 *    // => "http://www.example.com/bands/counting-crows"
 *    bandsPath({ id: 'ABC123' })
 *    // => "http://www.example.com/bands/ABC123"
 *
 * Options:
 *
 *  - 'controller'  the route's controller
 *  - 'action'      the route's action
 *  - `as`          name used to declare routing helpers
 *  - `via`         allowed HTTP method(s) for route
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
  options = options || {};
  
  if (typeof shorthand === 'string') {
    var split = shorthand.split('#');
    options.controller = split[0];
    options.action = split[1];
  }
  if (typeof shorthand === 'function' || Array.isArray(shorthand)) {
    // TODO: Implement unit test coverage for this functionality.
    
    // Mount functions or arrays of functions directly as Express route
    // handlers/middleware.
    var method = options.via || 'get';
    var path = (pattern[0] === '/') ? pattern : '/' + pattern;
    this._http[method](path, shorthand);
    return;
  }
  
  var controller = inflect._controllerize(options.controller);
  var action = inflect._actionize(options.action);
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
Router.prototype.resource = function(name, fn) {
  var controller = inflect._controllerize(name);
  
  this._nesting.push({ name: name, singleton: true });
  
  // TODO: Ensure that optional format parameters are available and handled
  //       correctly.
  
  var path = this._pathFromNesting();
  this._route('get' , path + '/new'     , controller, 'new');
  this._route('post', path              , controller, 'create');
  this._route('get' , path + '.:format?', controller, 'show');
  this._route('get' , path + '/edit'    , controller, 'edit');
  this._route('put' , path              , controller, 'update');
  this._route('del' , path              , controller, 'destroy');
  
  
  // TODO: Generate routing helpers for nested resources.
  if (this._nesting.length == 1) {
    var helpers = {};
    var dynamicHelpers = {};
    var helper;
  
    helper = inflect.camelize(name);
    helpers[helper + 'Path'] = pathHelper(controller, 'show');
    dynamicHelpers[helper + 'URL'] = urlHelper(controller, 'show');
    helper = inflect.capitalize(helper);
    helpers['new' + helper + 'Path'] = pathHelper(controller, 'new');
    dynamicHelpers['new' + helper + 'URL'] = urlHelper(controller, 'new');
    helpers['edit' + helper + 'Path'] = pathHelper(controller, 'edit');
    dynamicHelpers['edit' + helper + 'URL'] = urlHelper(controller, 'edit');
  
    this._express.helpers(helpers);
    this._express.dynamicHelpers(dynamicHelpers);
  }
  
  fn && fn.call(this);
  
  this._nesting.pop();
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
Router.prototype.resources = function(name, fn) {
  var controller = inflect._controllerize(name);
  
  this._nesting.push({ name: name, singleton: false });
  
  // TODO: Ensure that optional format parameters are available and handled
  //       correctly.
  
  var path = this._pathFromNesting();
  this._route('get' , path                   , controller, 'index');
  this._route('get' , path + '/new'          , controller, 'new');
  this._route('post', path                   , controller, 'create');
  this._route('get' , path + '/:id.:format?' , controller, 'show');
  this._route('get' , path + '/:id/edit'     , controller, 'edit');
  this._route('put' , path + '/:id'          , controller, 'update');
  this._route('del' , path + '/:id'          , controller, 'destroy');
  
  
  // TODO: Generate routing helpers for nested resources.
  if (this._nesting.length == 1) {
    var helpers = {};
    var dynamicHelpers = {};
    var helper
  
    helper = inflect.camelize(name);
    helpers[helper + 'Path'] = pathHelper(controller, 'index');
    dynamicHelpers[helper + 'URL'] = urlHelper(controller, 'index');
    helper = inflect.en.singularize(helper);
    helpers[helper + 'Path'] = pathHelper(controller, 'show');
    dynamicHelpers[helper + 'URL'] = urlHelper(controller, 'show');
    helper = inflect.capitalize(helper);
    helpers['new' + helper + 'Path'] = pathHelper(controller, 'new');
    dynamicHelpers['new' + helper + 'URL'] = urlHelper(controller, 'new');
    helpers['edit' + helper + 'Path'] = pathHelper(controller, 'edit');
    dynamicHelpers['edit' + helper + 'URL'] = urlHelper(controller, 'edit');
  
    this._express.helpers(helpers);
    this._express.dynamicHelpers(dynamicHelpers);
  }

  fn && fn.call(this);
  
  this._nesting.pop();
}

/**
 * Create namespace in which to organize routes.
 *
 * Typically, you might want to group administrative routes under an `admin`
 * namespace.  Controllers for these routes would be placed in the `app/controllers/admin`
 * directory.
 *
 * A namespace with resourceful routes, such as:
 *
 *     this.namespace('admin', function() {
 *       this.resources('posts');
 *     });
 *
 * creates routes routes handled by `Admin::PostsController`:
 *
 *     GET     /admin/posts
 *     GET     /admin/posts/new
 *     POST    /admin/posts
 *     GET     /admin/posts/:id
 *     GET     /admin/posts/:id/edit
 *     PUT     /admin/posts/:id
 *     DELETE  /admin/posts/:id
 *
 * @param {String} name
 * @param {Function} fn
 * @api public
 */
// TODO: Unit test this functionality
Router.prototype.namespace = function(name, options, fn) {
  if (typeof options === 'function') {
    fn = options;
    options = {};
  }
  options = options || {};
  
  this._ns.push(new Namespace(name, options));
  fn.call(this);
  this._ns.pop();
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
  // TODO: Ensure that controller is fully qualified.
  var route = new Route(method, pattern, controller, action);
  this._routes[route.reverseKey()] = route;
  
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
 * Creates a path from the accumulated nesting components.
 * 
 * @api private
 */
Router.prototype._pathFromNesting = function() {
  var comps = [''];
  var nesting = this._nesting;
  for (var i = 0, len = nesting.length; i < len; i++) {
    var spec = nesting[i];
    comps.push(spec.name);
    if (!spec.singleton && i !== len - 1) {
      comps.push(':' + inflect.en.singularize(spec.name) + 'ID');
    }
  }
  return comps.join('/');
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
