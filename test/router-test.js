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


vows.describe('Router').addBatch({
  
  'router for root': {
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
    
    'should build route when given hash shorthand': function (router) {
      router.root('pages#main');
      
      assert.length(router._http._routes, 1);
      assert.equal(router._http._routes[0].method, 'GET');
      assert.equal(router._http._routes[0].path, '/');
      assert.equal(router._http._routes[0].fn().controller, 'PagesController');
      assert.equal(router._http._routes[0].fn().action, 'main');
      
      var route = router._find('PagesController', 'main');
      assert.equal(route.method, 'get');
      assert.equal(route.pattern, '/');
      
      router._http.reset();
    },
  },
  
  'router for match': {
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
    
    'should build route when given hash shorthand': function (router) {
      router.match('songs/:title', 'songs#show');
      
      assert.length(router._http._routes, 1);
      assert.equal(router._http._routes[0].method, 'GET');
      assert.equal(router._http._routes[0].path, '/songs/:title');
      assert.equal(router._http._routes[0].fn().controller, 'SongsController');
      assert.equal(router._http._routes[0].fn().action, 'show');
      
      var route = router._find('SongsController', 'show');
      assert.equal(route.method, 'get');
      assert.equal(route.pattern, '/songs/:title');
      
      router._http.reset();
    },
    
    'should build route when given controller and action options': function (router) {
      router.match('bands', { controller: 'bands', action: 'list' });
      
      assert.length(router._http._routes, 1);
      assert.equal(router._http._routes[0].method, 'GET');
      assert.equal(router._http._routes[0].path, '/bands');
      assert.equal(router._http._routes[0].fn().controller, 'BandsController');
      assert.equal(router._http._routes[0].fn().action, 'list');
      
      var route = router._find('BandsController', 'list');
      assert.equal(route.method, 'get');
      assert.equal(route.pattern, '/bands');
      
      router._http.reset();
    },
    
    'should build route when given hash shorthand and via in options': function (router) {
      router.match('bands', 'bands#create', { via: 'post' });
      
      assert.length(router._http._routes, 1);
      assert.equal(router._http._routes[0].method, 'POST');
      assert.equal(router._http._routes[0].path, '/bands');
      assert.equal(router._http._routes[0].fn().controller, 'BandsController');
      assert.equal(router._http._routes[0].fn().action, 'create');
      
      var route = router._find('BandsController', 'create');
      assert.equal(route.method, 'post');
      assert.equal(route.pattern, '/bands');
      
      router._http.reset();
    },
    
    'should build route when given controller, action, and via in options': function (router) {
      router.match('bands', { controller: 'bands', action: 'create', via: 'post' });
      
      assert.length(router._http._routes, 1);
      assert.equal(router._http._routes[0].method, 'POST');
      assert.equal(router._http._routes[0].path, '/bands');
      assert.equal(router._http._routes[0].fn().controller, 'BandsController');
      assert.equal(router._http._routes[0].fn().action, 'create');
      
      var route = router._find('BandsController', 'create');
      assert.equal(route.method, 'post');
      assert.equal(route.pattern, '/bands');
      
      router._http.reset();
    },
    
    'should not prepend slash when route begins with slash': function (router) {
      router.match('/songs/:title', 'songs#show');
      
      assert.length(router._http._routes, 1);
      assert.equal(router._http._routes[0].method, 'GET');
      assert.equal(router._http._routes[0].path, '/songs/:title');
      assert.equal(router._http._routes[0].fn().controller, 'SongsController');
      assert.equal(router._http._routes[0].fn().action, 'show');
      
      router._http.reset();
    },
    
    'should add helpers when as option is set': function (router) {
      router.match('songs', 'songs#list', { as: 'songs' });
      
      assert.isFunction(router._express._helpers.songsPath);
      assert.isFunction(router._express._dynamicHelpers.songsURL);
      var songsURL = router._express._dynamicHelpers.songsURL({}, {});
      assert.isFunction(songsURL);
      
      router._http.reset();
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
      
      assert.length(router._http._routes, 6);
      
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
      
      assert.length(router._http._routes, 7);
      
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
    },
  },
  
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
