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
  this._http = http;
  this._handle = options.handle || handle;
}

/**
 * Create a route for the root ('/') resource.
 *
 * For options, see `match` as `root` invokes it internally.
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
 * Matches a URL pattern to a route.
 *
 * Options:
 *
 *  - `via`  allowed HTTP method for this route
 *
 *         this.match('bands', 'bands#create', { via: 'post' });
 * 
 * Examples:
 *
 *     this.match('songs/:title', 'songs#show');
 *
 *     this.match('songs/:title', { controller: 'songs', action: 'show' });
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
  
  var controller = inflect.camelize(options.controller, true).concat('Controller');
  var action = options.action;
  var method = options.via || 'get';
  
  var path = '/' + pattern;
  this._http[method](path, this._handle(controller, action).bind(this._app));
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
 * creates seven different routes in the application, executed by
 *`ProfileController` (note that the controller is singular).
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
  var controller = inflect.camelize(name, true).concat('Controller');
  
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
  var controller = inflect.camelize(name, true).concat('Controller');
  
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
 * Builds a function to handle a route with given `controller`, `action`, and
 * `options`.
 *
 * @param {String} controller
 * @param {String} action
 * @param {Object} options
 * @return {Function}
 * @api private
 */
function handle(controller, action, options) {
  // TODO: Ensure coverage by unit tests.
  options = options || {};
  
  return function(req, res, next){
    var prototype = this.controller(controller);
    if (!prototype) {
      return next(new RouterError('No controller for ' + controller + '#' + action));
    }
    
    var instance = Object.create(prototype);
    instance._prepare(req, res, next);
    instance._invoke(action);
  }
}


/**
 * Expose `Router`.
 */
exports = module.exports = Router;
