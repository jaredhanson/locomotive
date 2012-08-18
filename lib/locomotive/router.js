/**
 * Module dependencies.
 */
var lingo = require('lingo')
  , util = require('util')
  , utils = require('./utils')
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
  this._ns = [];
  this._ns.push(new Namespace());
}

/**
 * Initialize `Router`.
 *
 * Options:
 *   - `handle`  override default handler function factory
 * 
 * @param {express} http
 * @param {Object} options
 * @api protected
 */
Router.prototype.init = function(http, options) {
  options = options || {};
  
  // Save instance of low-level Express HTTP server.  Routes drawn through
  // Locomotive's router will be compiled into Express routes.
  this._http = http;
  this._handle = options.handle || handle;
}

/**
 * Draw routes.
 *
 * Executes `fn` in the context of the `Router` instance.
 *
 * @param {Function} fn
 * @api protected
 */
Router.prototype.draw = function(fn) {
  fn.apply(this);
}

/**
 * Create a route to the root path ('/').
 *
 * For options, see `match()`, as `root()` invokes it internally.
 *
 * The root route should be placed at the top of `config/routes.js` in order to
 * match against it first.  As this route is typically the most popular route of
 * a web application, this is an optimization.
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
 *
 * If an `as` option is specified, path and URL routing helper functions will be
 * dynamically declared.  For example, given the following route:
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
  
  var ns = this._ns[this._ns.length - 1]
    , method = (options.via || 'get')
    , methods = Array.isArray(method) ? method : [method]
    , path = ns.qpath(pattern)
    , controller = ns.qcontroller(options.controller)
    , action = utils.actionize(options.action)
    , helper = utils.helperize(options.as);
  
  for (var i = 0, len = methods.length; i < len; i++) {
    var method = methods[i].toLowerCase();
    if (typeof shorthand === 'function' || Array.isArray(shorthand)) {
      // Mount functions or arrays of functions directly as Express route
      // handlers/middleware.
      this._http[method](path, shorthand);
    } else {
      this._route(method, path, controller, action, { helper: helper });
    }
  }
}

/**
 * Create resourceful routes for singleton resource `name`.
 *
 * A resourceful route provides a mapping between HTTP URLs and methods and
 * corresponding controller actions.  A single entry in the route configuration,
 * such as:
 *
 *     this.resource('profile');
 *
 * creates six different routes in the application, all handled by
 * `ProfileController` (note that the controller is singular).
 *
 *     GET     /profile/new   -> new()
 *     POST    /profile       -> create()
 *     GET     /profile       -> show()
 *     GET     /profile/edit  -> edit()
 *     PUT     /profile       -> update()
 *     DELETE  /profile       -> destroy()
 *
 * Additionally, path and URL routing helpers will be dynamically declared.
 *
 *     profilePath()
 *     // => "/profile"
 *     newProfilePath()
 *     // => "/profile/new"
 *     editAccountPath()
 *     // => "/profile/edit"
 *
 *     profileURL()
 *     // => "http://www.example.com/profile"
 *     newProfileURL()
 *     // => "http://www.example.com/profile/new"
 *     editAccountURL()
 *     // => "http://www.example.com/profile/edit"
 *
 * The singleton variation of a resourceful route is useful for resources which
 * are referenced without an ID, such as /profile, which always shows the
 * profile of the currently logged in user.  In this case, a singular resource
 * maps /profile (rather than /profile/:id) to the show action.
 * 
 * Examples:
 *
 *     this.resource('profile');
 *
 * @param {String} name
 * @api public
 */
Router.prototype.resource = function(name, options, fn) {
  if (typeof options === 'function') {
    fn = options;
    options = {};
  }
  options = options || {}
  
  var ns = this._ns[this._ns.length - 1]
    , path = ns.qpath(name)
    , controller = ns.qcontroller(name)
    , helper = ns.qhelper(name);
  
  this._route('get' , path + '/new.:format?' , controller, 'new'     , { helper: utils.helperize('new', helper) });
  this._route('post', path                   , controller, 'create' );
  this._route('get' , path + '.:format?'     , controller, 'show'    , { helper: helper });
  this._route('get' , path + '/edit.:format?', controller, 'edit'    , { helper: utils.helperize('edit', helper) });
  this._route('put' , path                   , controller, 'update' );
  this._route('del' , path                   , controller, 'destroy');
  
  this.namespace(name, { module: options.namespace ? name : null, helper: name }, function() {
    fn && fn.call(this);
  });
}

/**
 * Create resourceful routes for collection resource `name`.
 *
 * A resourceful route provides a mapping between HTTP URLs and methods and
 * corresponding controller functions.  A single entry in the route
 * configuration, such as:
 *
 *     this.resources('photos');
 *
 * creates seven different routes in the application, executed by
 * `PhotosController`.
 *
 *     GET     /photos           -> index()
 *     GET     /photos/new       -> new()
 *     POST    /photos           -> create()
 *     GET     /photos/:id       -> show()
 *     GET     /photos/:id/edit  -> edit()
 *     PUT     /photos/:id       -> update()
 *     DELETE  /photos/:id       -> destroy()
 *
 * Additionally, path and URL routing helpers will be dynamically declared.
 *
 *     photosPath()
 *     // => "/photos"
 *     photoPath('abc123')
 *     // => "/photos/abc123"
 *     newPhotoPath()
 *     // => "/photos/new"
 *     editPhotoPath('abc123')
 *     // => "/photos/abc123/edit"
 *
 * Resources can also be nested infinately using callback syntax:
 *
 *     router.resources('bands', function() {
 *       this.resources('albums');
 *     });
 * 
 * Examples:
 *
 *     this.resources('photos');
 *
 * @param {String} name
 * @api public
 */
Router.prototype.resources = function(name, options, fn) {
  if (typeof options === 'function') {
    fn = options;
    options = {};
  }
  options = options || {}
  
  var ns = this._ns[this._ns.length - 1]
    , singular = lingo.en.singularize(name)
    , path = ns.qpath(name)
    , controller = ns.qcontroller(name)
    , helper = ns.qhelper(singular)
    , collectionHelper = ns.qhelper(name)
    , placeholder;
  
  this._route('get' , path + '.:format?'         , controller, 'index'   , { helper: collectionHelper });
  this._route('get' , path + '/new.:format?'     , controller, 'new'     , { helper: utils.helperize('new', helper) });
  this._route('post', path                       , controller, 'create' );
  this._route('get' , path + '/:id.:format?'     , controller, 'show'    , { helper: helper });
  this._route('get' , path + '/:id/edit.:format?', controller, 'edit'    , { helper: utils.helperize('edit', helper) });
  this._route('put' , path + '/:id'              , controller, 'update' );
  this._route('del' , path + '/:id'              , controller, 'destroy');
  
  placeholder = ':' + utils.helperize(singular) + '_id';
  this.namespace(name + '/' + placeholder, { module: options.namespace ? name : null, helper: singular }, function() {
    fn && fn.call(this);
  });
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
 * creates namespaced routes handled by `Admin::PostsController`:
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
Router.prototype.namespace = function(name, options, fn) {
  if (typeof options === 'function') {
    fn = options;
    options = {};
  }
  options = options || {};
  
  var ns = this._ns[this._ns.length - 1];
  this._ns.push(new Namespace(name, options, ns));
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
Router.prototype._route = function(method, pattern, controller, action, options) {
  options = options || {};
  
  // Mount the route handler in the underlying Express HTTP framework.  This
  // handler will service incoming requests that match the route.
  this._http[method](pattern, this._handle(controller, action).bind(this._app));
  
  // Add the route to the reverse routing table.  The reverse routing table is
  // used by routing helper functions to construct URLs to a specific controller
  // and action.  When building paths and URLs, routes declared first take
  // priority.  Therefore, if there is already an entry for this controller and
  // action in the table, don't overwrite it.
  var route = new Route(method, pattern, controller, action);
  
  var key = route.reverseKey();
  if (!this._routes[key]) {
    this._routes[key] = route;
  }
  
  // Declare path and URL routing helper functions.
  if (options.helper) {
    var helper = options.helper;
    this._app.helper(helper + 'Path', route.helper());
    this._app.dynamicHelper(helper + 'URL', route.helper(true));
  }
}

/**
 * Find route to `controller` and `action`.
 * 
 * @param {String} controller
 * @param {String} action
 * @return {Route}
 * @api protected
 */
Router.prototype.find = function(controller, action) {
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
    instance._init(req, res, next);
    instance._invoke(action);
  }
}


/**
 * Expose `Router`.
 */
exports = module.exports = Router;
