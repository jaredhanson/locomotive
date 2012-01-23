var vows = require('vows');
var assert = require('assert');
var util = require('util');
var Router = require('locomotive/router');
var Route = require('locomotive/route');
var dynamicHelpers = require('locomotive/helpers/dynamic');


/* MockLocomotive */

function MockLocomotive() {
  var self = this;
  this._routes = {};
  this._routes._find = function(controller, action) {
    var key = controller + '#' + action;
    return self._routes[key];
  }
}

/* MockExpress */

function MockExpress() {
  this._routes = [];
  this._helpers = {};
  this._dynamicHelpers = {};
}

MockExpress.prototype.get = function(path, fn) {
  this._routes.push({ method: 'GET', path: path, fn: fn });
}

MockExpress.prototype.post = function(path, fn) {
  this._routes.push({ method: 'POST', path: path, fn: fn });
}

MockExpress.prototype.put = function(path, fn) {
  this._routes.push({ method: 'PUT', path: path, fn: fn });
}

MockExpress.prototype.del = function(path, fn) {
  this._routes.push({ method: 'DELETE', path: path, fn: fn });
}

MockExpress.prototype.helpers = function(obj) {
  for (var method in obj) {
    this._helpers[method] = obj[method];
  }
}

MockExpress.prototype.dynamicHelpers = function(obj) {
  for (var method in obj) {
    this._dynamicHelpers[method] = obj[method];
  }
}

MockExpress.prototype.reset = function() {
  this._routes = [];
  this._helpers = {};
  this._dynamicHelpers = {};
}

/* MockRequest */

function MockRequest() {
}

/* MockResponse */

function MockResponse() {
}


function intializedRouter() {
  var router = new Router();
  var http = new MockExpress();
  function handle(controller, action) {
    return function() {
      return { controller: controller, action: action };
    };
  }
  
  router.init(http, { handle: handle });
  return router;
}


vows.describe('Router').addBatch({
  
  'router with root route': {
    topic: function() {
      var router = intializedRouter()
      router.root('pages#main');
      return router;
    },
    
    'should create route': function (router) {
      var route = router._find('PagesController', 'main');
      assert.equal(route.method, 'get');
      assert.equal(route.pattern, '/');
    },
    'should mount route': function (router) {
      assert.lengthOf(router._http._routes, 1);
      assert.equal(router._http._routes[0].method, 'GET');
      assert.equal(router._http._routes[0].path, '/');
      assert.equal(router._http._routes[0].fn().controller, 'PagesController');
      assert.equal(router._http._routes[0].fn().action, 'main');
    },
  },
  
  'router with match route given shorthand': {
    topic: function() {
      var router = intializedRouter()
      router.match('songs/:title', 'songs#show');
      return router;
    },
    
    'should create route': function (router) {
      var route = router._find('SongsController', 'show');
      assert.equal(route.method, 'get');
      assert.equal(route.pattern, '/songs/:title');
    },
    'should mount route': function (router) {
      assert.lengthOf(router._http._routes, 1);
      assert.equal(router._http._routes[0].method, 'GET');
      assert.equal(router._http._routes[0].path, '/songs/:title');
      assert.equal(router._http._routes[0].fn().controller, 'SongsController');
      assert.equal(router._http._routes[0].fn().action, 'show');
    },
  },
  
  'router with match route given controller and action options': {
    topic: function() {
      var router = intializedRouter()
      router.match('bands', { controller: 'bands', action: 'list' });
      return router;
    },
    
    'should create route': function (router) {
      var route = router._find('BandsController', 'list');
      assert.equal(route.method, 'get');
      assert.equal(route.pattern, '/bands');
    },
    'should mount route': function (router) {
      assert.lengthOf(router._http._routes, 1);
      assert.equal(router._http._routes[0].method, 'GET');
      assert.equal(router._http._routes[0].path, '/bands');
      assert.equal(router._http._routes[0].fn().controller, 'BandsController');
      assert.equal(router._http._routes[0].fn().action, 'list');
    },
  },
  
  'router with match route given shorthand and via option': {
    topic: function() {
      var router = intializedRouter()
      router.match('bands', 'bands#create', { via: 'post' });
      return router;
    },
    
    'should create route': function (router) {
      var route = router._find('BandsController', 'create');
      assert.equal(route.method, 'post');
      assert.equal(route.pattern, '/bands');
    },
    'should mount route': function (router) {
      assert.lengthOf(router._http._routes, 1);
      assert.equal(router._http._routes[0].method, 'POST');
      assert.equal(router._http._routes[0].path, '/bands');
      assert.equal(router._http._routes[0].fn().controller, 'BandsController');
      assert.equal(router._http._routes[0].fn().action, 'create');
    },
  },
  
  'router with match route given controller, action, and via options': {
    topic: function() {
      var router = intializedRouter()
      router.match('bands', { controller: 'bands', action: 'create', via: 'post' });
      return router;
    },
    
    'should create route': function (router) {
      var route = router._find('BandsController', 'create');
      assert.equal(route.method, 'post');
      assert.equal(route.pattern, '/bands');
    },
    'should mount route': function (router) {
      assert.lengthOf(router._http._routes, 1);
      assert.equal(router._http._routes[0].method, 'POST');
      assert.equal(router._http._routes[0].path, '/bands');
      assert.equal(router._http._routes[0].fn().controller, 'BandsController');
      assert.equal(router._http._routes[0].fn().action, 'create');
    },
  },
  
  'router with match route specified with a preceding slash': {
    topic: function() {
      var router = intializedRouter()
      router.match('/songs/:title', 'songs#show');
      return router;
    },
    
    'should create route': function (router) {
      var route = router._find('SongsController', 'show');
      assert.equal(route.method, 'get');
      assert.equal(route.pattern, '/songs/:title');
    },
    'should mount route': function (router) {
      assert.lengthOf(router._http._routes, 1);
      assert.equal(router._http._routes[0].method, 'GET');
      assert.equal(router._http._routes[0].path, '/songs/:title');
      assert.equal(router._http._routes[0].fn().controller, 'SongsController');
      assert.equal(router._http._routes[0].fn().action, 'show');
    },
  },
  
  'router with match route that declares helpers': {
    topic: function() {
      var router = intializedRouter()
      router.match('songs', 'songs#list', { as: 'songs' });
      return router;
    },
    
    'should declare helpers': function (router) {
      assert.isFunction(router._express._helpers.songsPath);
      assert.isFunction(router._express._dynamicHelpers.songsURL);
      var songsURL = router._express._dynamicHelpers.songsURL({}, {});
      assert.isFunction(songsURL);
    },
  },
  
  'router for resource': {
    topic: function() {
      var router = new Router();
      var http = new MockExpress();
      function handle(controller, action, options) {
        return function() {
          return { controller: controller, action: action, options: options };
        };
      }
      
      router.init(http, { handle: handle });
      return router;
    },
    
    'should build RESTful routes': function (router) {
      router.resource('profile');
      var route;
      
      assert.lengthOf(router._http._routes, 6);
      
      assert.equal(router._http._routes[0].method, 'GET');
      assert.equal(router._http._routes[0].path, '/profile/new');
      assert.equal(router._http._routes[0].fn().controller, 'ProfileController');
      assert.equal(router._http._routes[0].fn().action, 'new');
      route = router._find('ProfileController', 'new');
      assert.equal(route.method, 'get');
      assert.equal(route.pattern, '/profile/new');
      
      assert.equal(router._http._routes[1].method, 'POST');
      assert.equal(router._http._routes[1].path, '/profile');
      assert.equal(router._http._routes[1].fn().controller, 'ProfileController');
      assert.equal(router._http._routes[1].fn().action, 'create');
      route = router._find('ProfileController', 'create');
      assert.equal(route.method, 'post');
      assert.equal(route.pattern, '/profile');
      
      assert.equal(router._http._routes[2].method, 'GET');
      assert.equal(router._http._routes[2].path, '/profile.:format?');
      assert.equal(router._http._routes[2].fn().controller, 'ProfileController');
      assert.equal(router._http._routes[2].fn().action, 'show');
      route = router._find('ProfileController', 'show');
      assert.equal(route.method, 'get');
      assert.equal(route.pattern, '/profile.:format?');
      
      assert.equal(router._http._routes[3].method, 'GET');
      assert.equal(router._http._routes[3].path, '/profile/edit');
      assert.equal(router._http._routes[3].fn().controller, 'ProfileController');
      assert.equal(router._http._routes[3].fn().action, 'edit');
      route = router._find('ProfileController', 'edit');
      assert.equal(route.method, 'get');
      assert.equal(route.pattern, '/profile/edit');
      
      assert.equal(router._http._routes[4].method, 'PUT');
      assert.equal(router._http._routes[4].path, '/profile');
      assert.equal(router._http._routes[4].fn().controller, 'ProfileController');
      assert.equal(router._http._routes[4].fn().action, 'update');
      route = router._find('ProfileController', 'update');
      assert.equal(route.method, 'put');
      assert.equal(route.pattern, '/profile');
      
      assert.equal(router._http._routes[5].method, 'DELETE');
      assert.equal(router._http._routes[5].path, '/profile');
      assert.equal(router._http._routes[5].fn().controller, 'ProfileController');
      assert.equal(router._http._routes[5].fn().action, 'destroy');
      route = router._find('ProfileController', 'destroy');
      assert.equal(route.method, 'del');
      assert.equal(route.pattern, '/profile');
      
      
      assert.isFunction(router._express._helpers.profilePath);
      assert.isFunction(router._express._helpers.newProfilePath);
      assert.isFunction(router._express._helpers.editProfilePath);
      assert.isFunction(router._express._dynamicHelpers.profileURL);
      assert.isFunction(router._express._dynamicHelpers.newProfileURL);
      assert.isFunction(router._express._dynamicHelpers.editProfileURL);
    },
  },
  
  'router for resources': {
    topic: function() {
      var router = new Router();
      var http = new MockExpress();
      function handle(controller, action, options) {
        return function() {
          return { controller: controller, action: action, options: options };
        };
      }
      
      router.init(http, { handle: handle });
      return router;
    },
    
    'should build RESTful routes': function (router) {
      router.resources('bands');
      var route;
      
      assert.lengthOf(router._http._routes, 7);
      
      assert.equal(router._http._routes[0].method, 'GET');
      assert.equal(router._http._routes[0].path, '/bands');
      assert.equal(router._http._routes[0].fn().controller, 'BandsController');
      assert.equal(router._http._routes[0].fn().action, 'index');
      route = router._find('BandsController', 'index');
      assert.equal(route.method, 'get');
      assert.equal(route.pattern, '/bands');
      
      assert.equal(router._http._routes[1].method, 'GET');
      assert.equal(router._http._routes[1].path, '/bands/new');
      assert.equal(router._http._routes[1].fn().controller, 'BandsController');
      assert.equal(router._http._routes[1].fn().action, 'new');
      route = router._find('BandsController', 'new');
      assert.equal(route.method, 'get');
      assert.equal(route.pattern, '/bands/new');
      
      assert.equal(router._http._routes[2].method, 'POST');
      assert.equal(router._http._routes[2].path, '/bands');
      assert.equal(router._http._routes[2].fn().controller, 'BandsController');
      assert.equal(router._http._routes[2].fn().action, 'create');
      route = router._find('BandsController', 'create');
      assert.equal(route.method, 'post');
      assert.equal(route.pattern, '/bands');
      
      assert.equal(router._http._routes[3].method, 'GET');
      assert.equal(router._http._routes[3].path, '/bands/:id.:format?');
      assert.equal(router._http._routes[3].fn().controller, 'BandsController');
      assert.equal(router._http._routes[3].fn().action, 'show');
      route = router._find('BandsController', 'show');
      assert.equal(route.method, 'get');
      assert.equal(route.pattern, '/bands/:id.:format?');
      
      assert.equal(router._http._routes[4].method, 'GET');
      assert.equal(router._http._routes[4].path, '/bands/:id/edit');
      assert.equal(router._http._routes[4].fn().controller, 'BandsController');
      assert.equal(router._http._routes[4].fn().action, 'edit');
      route = router._find('BandsController', 'edit');
      assert.equal(route.method, 'get');
      assert.equal(route.pattern, '/bands/:id/edit');
      
      assert.equal(router._http._routes[5].method, 'PUT');
      assert.equal(router._http._routes[5].path, '/bands/:id');
      assert.equal(router._http._routes[5].fn().controller, 'BandsController');
      assert.equal(router._http._routes[5].fn().action, 'update');
      route = router._find('BandsController', 'update');
      assert.equal(route.method, 'put');
      assert.equal(route.pattern, '/bands/:id');
      
      assert.equal(router._http._routes[6].method, 'DELETE');
      assert.equal(router._http._routes[6].path, '/bands/:id');
      assert.equal(router._http._routes[6].fn().controller, 'BandsController');
      assert.equal(router._http._routes[6].fn().action, 'destroy');
      route = router._find('BandsController', 'destroy');
      assert.equal(route.method, 'del');
      assert.equal(route.pattern, '/bands/:id');
      
      
      assert.isFunction(router._express._helpers.bandsPath);
      assert.isFunction(router._express._helpers.bandPath);
      assert.isFunction(router._express._helpers.newBandPath);
      assert.isFunction(router._express._helpers.editBandPath);
      assert.isFunction(router._express._dynamicHelpers.bandsURL);
      assert.isFunction(router._express._dynamicHelpers.bandURL);
      assert.isFunction(router._express._dynamicHelpers.newBandURL);
      assert.isFunction(router._express._dynamicHelpers.editBandURL);
    },
  },
  
  'router for resource nested under resource': {
    topic: function() {
      var router = new Router();
      var http = new MockExpress();
      function handle(controller, action, options) {
        return function() {
          return { controller: controller, action: action, options: options };
        };
      }
      
      router.init(http, { handle: handle });
      return router;
    },
    
    'should build RESTful routes': function (router) {
      router.resource('account', function() {
        this.resource('password');
      });
      
      var route;
      
      assert.lengthOf(router._http._routes, 12);
      
      assert.equal(router._http._routes[0].method, 'GET');
      assert.equal(router._http._routes[0].path, '/account/new');
      assert.equal(router._http._routes[0].fn().controller, 'AccountController');
      assert.equal(router._http._routes[0].fn().action, 'new');
      
      assert.equal(router._http._routes[1].method, 'POST');
      assert.equal(router._http._routes[1].path, '/account');
      assert.equal(router._http._routes[1].fn().controller, 'AccountController');
      assert.equal(router._http._routes[1].fn().action, 'create');
      
      assert.equal(router._http._routes[2].method, 'GET');
      assert.equal(router._http._routes[2].path, '/account.:format?');
      assert.equal(router._http._routes[2].fn().controller, 'AccountController');
      assert.equal(router._http._routes[2].fn().action, 'show');
      
      assert.equal(router._http._routes[3].method, 'GET');
      assert.equal(router._http._routes[3].path, '/account/edit');
      assert.equal(router._http._routes[3].fn().controller, 'AccountController');
      assert.equal(router._http._routes[3].fn().action, 'edit');
      
      assert.equal(router._http._routes[4].method, 'PUT');
      assert.equal(router._http._routes[4].path, '/account');
      assert.equal(router._http._routes[4].fn().controller, 'AccountController');
      assert.equal(router._http._routes[4].fn().action, 'update');
      
      assert.equal(router._http._routes[5].method, 'DELETE');
      assert.equal(router._http._routes[5].path, '/account');
      assert.equal(router._http._routes[5].fn().controller, 'AccountController');
      assert.equal(router._http._routes[5].fn().action, 'destroy');
      
      assert.equal(router._http._routes[6].method, 'GET');
      assert.equal(router._http._routes[6].path, '/account/password/new');
      assert.equal(router._http._routes[6].fn().controller, 'PasswordController');
      assert.equal(router._http._routes[6].fn().action, 'new');
      
      assert.equal(router._http._routes[7].method, 'POST');
      assert.equal(router._http._routes[7].path, '/account/password');
      assert.equal(router._http._routes[7].fn().controller, 'PasswordController');
      assert.equal(router._http._routes[7].fn().action, 'create');
      
      assert.equal(router._http._routes[8].method, 'GET');
      assert.equal(router._http._routes[8].path, '/account/password.:format?');
      assert.equal(router._http._routes[8].fn().controller, 'PasswordController');
      assert.equal(router._http._routes[8].fn().action, 'show');
      
      assert.equal(router._http._routes[9].method, 'GET');
      assert.equal(router._http._routes[9].path, '/account/password/edit');
      assert.equal(router._http._routes[9].fn().controller, 'PasswordController');
      assert.equal(router._http._routes[9].fn().action, 'edit');
      
      assert.equal(router._http._routes[10].method, 'PUT');
      assert.equal(router._http._routes[10].path, '/account/password');
      assert.equal(router._http._routes[10].fn().controller, 'PasswordController');
      assert.equal(router._http._routes[10].fn().action, 'update');
      
      assert.equal(router._http._routes[11].method, 'DELETE');
      assert.equal(router._http._routes[11].path, '/account/password');
      assert.equal(router._http._routes[11].fn().controller, 'PasswordController');
      assert.equal(router._http._routes[11].fn().action, 'destroy');
      
      
      assert.isFunction(router._express._helpers.accountPath);
      assert.isFunction(router._express._helpers.newAccountPath);
      assert.isFunction(router._express._helpers.editAccountPath);
      assert.isFunction(router._express._dynamicHelpers.accountURL);
      assert.isFunction(router._express._dynamicHelpers.newAccountURL);
      assert.isFunction(router._express._dynamicHelpers.editAccountURL);
      
      assert.isUndefined(router._express._helpers.passwordPath);
      assert.isUndefined(router._express._helpers.newPasswordPath);
      assert.isUndefined(router._express._helpers.editPasswordPath);
      assert.isUndefined(router._express._dynamicHelpers.passwordURL);
      assert.isUndefined(router._express._dynamicHelpers.newPasswordURL);
      assert.isUndefined(router._express._dynamicHelpers.editPasswordURL);
    },
  },
  
  'router for resources nested under resources': {
    topic: function() {
      var router = new Router();
      var http = new MockExpress();
      function handle(controller, action, options) {
        return function() {
          return { controller: controller, action: action, options: options };
        };
      }
      
      router.init(http, { handle: handle });
      return router;
    },
    
    'should build RESTful routes': function (router) {
      router.resources('bands', function() {
        this.resources('albums');
      });
      
      var route;
      
      assert.lengthOf(router._http._routes, 14);
      
      assert.equal(router._http._routes[0].method, 'GET');
      assert.equal(router._http._routes[0].path, '/bands');
      assert.equal(router._http._routes[0].fn().controller, 'BandsController');
      assert.equal(router._http._routes[0].fn().action, 'index');
      
      assert.equal(router._http._routes[1].method, 'GET');
      assert.equal(router._http._routes[1].path, '/bands/new');
      assert.equal(router._http._routes[1].fn().controller, 'BandsController');
      assert.equal(router._http._routes[1].fn().action, 'new');
      
      assert.equal(router._http._routes[2].method, 'POST');
      assert.equal(router._http._routes[2].path, '/bands');
      assert.equal(router._http._routes[2].fn().controller, 'BandsController');
      assert.equal(router._http._routes[2].fn().action, 'create');
      
      assert.equal(router._http._routes[3].method, 'GET');
      assert.equal(router._http._routes[3].path, '/bands/:id.:format?');
      assert.equal(router._http._routes[3].fn().controller, 'BandsController');
      assert.equal(router._http._routes[3].fn().action, 'show');
      
      assert.equal(router._http._routes[4].method, 'GET');
      assert.equal(router._http._routes[4].path, '/bands/:id/edit');
      assert.equal(router._http._routes[4].fn().controller, 'BandsController');
      assert.equal(router._http._routes[4].fn().action, 'edit');
      
      assert.equal(router._http._routes[5].method, 'PUT');
      assert.equal(router._http._routes[5].path, '/bands/:id');
      assert.equal(router._http._routes[5].fn().controller, 'BandsController');
      assert.equal(router._http._routes[5].fn().action, 'update');
      
      assert.equal(router._http._routes[6].method, 'DELETE');
      assert.equal(router._http._routes[6].path, '/bands/:id');
      assert.equal(router._http._routes[6].fn().controller, 'BandsController');
      assert.equal(router._http._routes[6].fn().action, 'destroy');
      
      assert.equal(router._http._routes[7].method, 'GET');
      assert.equal(router._http._routes[7].path, '/bands/:bandID/albums');
      assert.equal(router._http._routes[7].fn().controller, 'AlbumsController');
      assert.equal(router._http._routes[7].fn().action, 'index');
      
      assert.equal(router._http._routes[8].method, 'GET');
      assert.equal(router._http._routes[8].path, '/bands/:bandID/albums/new');
      assert.equal(router._http._routes[8].fn().controller, 'AlbumsController');
      assert.equal(router._http._routes[8].fn().action, 'new');
      
      assert.equal(router._http._routes[9].method, 'POST');
      assert.equal(router._http._routes[9].path, '/bands/:bandID/albums');
      assert.equal(router._http._routes[9].fn().controller, 'AlbumsController');
      assert.equal(router._http._routes[9].fn().action, 'create');
      
      assert.equal(router._http._routes[10].method, 'GET');
      assert.equal(router._http._routes[10].path, '/bands/:bandID/albums/:id.:format?');
      assert.equal(router._http._routes[10].fn().controller, 'AlbumsController');
      assert.equal(router._http._routes[10].fn().action, 'show');
      
      assert.equal(router._http._routes[11].method, 'GET');
      assert.equal(router._http._routes[11].path, '/bands/:bandID/albums/:id/edit');
      assert.equal(router._http._routes[11].fn().controller, 'AlbumsController');
      assert.equal(router._http._routes[11].fn().action, 'edit');
      
      assert.equal(router._http._routes[12].method, 'PUT');
      assert.equal(router._http._routes[12].path, '/bands/:bandID/albums/:id');
      assert.equal(router._http._routes[12].fn().controller, 'AlbumsController');
      assert.equal(router._http._routes[12].fn().action, 'update');
      
      assert.equal(router._http._routes[13].method, 'DELETE');
      assert.equal(router._http._routes[13].path, '/bands/:bandID/albums/:id');
      assert.equal(router._http._routes[13].fn().controller, 'AlbumsController');
      assert.equal(router._http._routes[13].fn().action, 'destroy');
      
      
      assert.isFunction(router._express._helpers.bandsPath);
      assert.isFunction(router._express._helpers.bandPath);
      assert.isFunction(router._express._helpers.newBandPath);
      assert.isFunction(router._express._helpers.editBandPath);
      assert.isFunction(router._express._dynamicHelpers.bandsURL);
      assert.isFunction(router._express._dynamicHelpers.bandURL);
      assert.isFunction(router._express._dynamicHelpers.newBandURL);
      assert.isFunction(router._express._dynamicHelpers.editBandURL);
      
      assert.isUndefined(router._express._helpers.albumsPath);
      assert.isUndefined(router._express._helpers.albumPath);
      assert.isUndefined(router._express._helpers.newAlbumPath);
      assert.isUndefined(router._express._helpers.editAlbumPath);
      assert.isUndefined(router._express._dynamicHelpers.albumsURL);
      assert.isUndefined(router._express._dynamicHelpers.albumURL);
      assert.isUndefined(router._express._dynamicHelpers.newAlbumURL);
      assert.isUndefined(router._express._dynamicHelpers.editAlbumURL);
    },
  },
  
  // TODO: Ensure test coverage for resource nested under resources and vice-versa.
  
  'router for helper functions': {
    topic: function() {
      var router = new Router();
      var http = new MockExpress();
      function handle(controller, action, options) {
        return function() {
          return { controller: controller, action: action, options: options };
        };
      }
      
      router.init(http, { handle: handle });
      return router;
    },
    
    'helpers without placeholders behave correctly': function (router) {
      router.match('songs', 'songs#index', { as: 'songs' });
      
      // setup app and urlFor helper
      var app = new MockLocomotive();
      app._routes['SongsController#index'] = new Route('get', '/songs');
      var req = new MockRequest();
      req.headers = { 'host': 'www.example.com' };
      req.locomotive = app;
      var res = new MockResponse();
      
      var dynHelpers = {};
      for (var key in dynamicHelpers) {
        dynHelpers.urlFor = dynamicHelpers.urlFor.call(this, req, res);
      }
      // end setup
      
      assert.isFunction(router._express._helpers.songsPath);
      var songsPath = router._express._helpers.songsPath.bind(dynHelpers)
      assert.equal(songsPath(), '/songs');
      
      assert.isFunction(router._express._dynamicHelpers.songsURL);
      var songsURL = router._express._dynamicHelpers.songsURL(req, res).bind(dynHelpers);
      assert.isFunction(songsURL);
      assert.equal(songsURL(), 'http://www.example.com/songs');
      
      router._http.reset();
    },
    
    'helpers with placeholders behave correctly': function (router) {
      router.match('songs/:id', 'songs#show', { as: 'showSong' });
      
      // setup app and urlFor helper
      var app = new MockLocomotive();
      app._routes['SongsController#show'] = new Route('get', '/songs/:id');
      var req = new MockRequest();
      req.headers = { 'host': 'www.example.com' };
      req.locomotive = app;
      var res = new MockResponse();
      
      var dynHelpers = {};
      for (var key in dynamicHelpers) {
        dynHelpers.urlFor = dynamicHelpers.urlFor.call(this, req, res);
      }
      // end setup
      
      assert.isFunction(router._express._helpers.showSongPath);
      var showSongPath = router._express._helpers.showSongPath.bind(dynHelpers)
      assert.equal(showSongPath(7), '/songs/7');
      assert.equal(showSongPath('slug'), '/songs/slug');
      assert.equal(showSongPath({ id: 101 }), '/songs/101');
      
      assert.isFunction(router._express._dynamicHelpers.showSongURL);
      var showSongURL = router._express._dynamicHelpers.showSongURL(req, res).bind(dynHelpers);
      assert.isFunction(showSongURL);
      assert.equal(showSongURL(7), 'http://www.example.com/songs/7');
      assert.equal(showSongURL('slug'), 'http://www.example.com/songs/slug');
      assert.equal(showSongURL({ id: 101 }), 'http://www.example.com/songs/101');
      
      router._http.reset();
    },
  },
  
}).export(module);
