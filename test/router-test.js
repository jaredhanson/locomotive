var vows = require('vows');
var assert = require('assert');
var util = require('util');
var Router = require('locomotive/router');


function MockExpress() {
  this._routes = [];
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

MockExpress.prototype.reset = function() {
  this._routes = [];
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
      router._http.reset();
    },
    
    'should build route when given controller and action options': function (router) {
      router.match('bands', { controller: 'bands', action: 'list' });
      
      assert.length(router._http._routes, 1);
      assert.equal(router._http._routes[0].method, 'GET');
      assert.equal(router._http._routes[0].path, '/bands');
      assert.equal(router._http._routes[0].fn().controller, 'BandsController');
      assert.equal(router._http._routes[0].fn().action, 'list');
      router._http.reset();
    },
    
    'should build route when given hash shorthand and via in options': function (router) {
      router.match('bands', 'bands#create', { via: 'post' });
      
      assert.length(router._http._routes, 1);
      assert.equal(router._http._routes[0].method, 'POST');
      assert.equal(router._http._routes[0].path, '/bands');
      assert.equal(router._http._routes[0].fn().controller, 'BandsController');
      assert.equal(router._http._routes[0].fn().action, 'create');
      router._http.reset();
    },
    
    'should build route when given controller, action, and via in options': function (router) {
      router.match('bands', { controller: 'bands', action: 'create', via: 'post' });
      
      assert.length(router._http._routes, 1);
      assert.equal(router._http._routes[0].method, 'POST');
      assert.equal(router._http._routes[0].path, '/bands');
      assert.equal(router._http._routes[0].fn().controller, 'BandsController');
      assert.equal(router._http._routes[0].fn().action, 'create');
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
      
      assert.length(router._http._routes, 6);
      
      assert.equal(router._http._routes[0].method, 'GET');
      assert.equal(router._http._routes[0].path, '/profile/new');
      assert.equal(router._http._routes[0].fn().controller, 'ProfileController');
      assert.equal(router._http._routes[0].fn().action, 'new');
      
      assert.equal(router._http._routes[1].method, 'POST');
      assert.equal(router._http._routes[1].path, '/profile');
      assert.equal(router._http._routes[1].fn().controller, 'ProfileController');
      assert.equal(router._http._routes[1].fn().action, 'create');
      
      assert.equal(router._http._routes[2].method, 'GET');
      assert.equal(router._http._routes[2].path, '/profile:format?');
      assert.equal(router._http._routes[2].fn().controller, 'ProfileController');
      assert.equal(router._http._routes[2].fn().action, 'show');
      
      assert.equal(router._http._routes[3].method, 'GET');
      assert.equal(router._http._routes[3].path, '/profile/edit');
      assert.equal(router._http._routes[3].fn().controller, 'ProfileController');
      assert.equal(router._http._routes[3].fn().action, 'edit');
      
      assert.equal(router._http._routes[4].method, 'PUT');
      assert.equal(router._http._routes[4].path, '/profile');
      assert.equal(router._http._routes[4].fn().controller, 'ProfileController');
      assert.equal(router._http._routes[4].fn().action, 'update');
      
      assert.equal(router._http._routes[5].method, 'DELETE');
      assert.equal(router._http._routes[5].path, '/profile');
      assert.equal(router._http._routes[5].fn().controller, 'ProfileController');
      assert.equal(router._http._routes[5].fn().action, 'destroy');
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
      
      
      assert.length(router._http._routes, 7);
      
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
    },
  },
  
}).export(module);
