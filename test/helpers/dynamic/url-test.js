var vows = require('vows');
var assert = require('assert');
var util = require('util');
var Route = require('locomotive/route');
var helpers = require('locomotive/helpers');
var dynamicHelpers = require('locomotive/helpers/dynamic');


/* MockLocomotive */

function MockLocomotive() {
  var self = this;
  this._routes = {};
  this._routes['TestController#index'] = new Route('get', '/test');
  this._routes['AnimalsController#show'] = new Route('get', '/animals/:id');
  
  this._routes.find = function(controller, action) {
    var key = controller + '#' + action;
    return self._routes[key];
  }
  
  function animalURL(obj) {
    return this.urlFor({ controller: 'AnimalsController', action: 'show', id: obj.id });
  }
  function animalPath(obj) {
    return this.urlFor({ controller: 'AnimalsController', action: 'show', id: obj.id, onlyPath: true });
  }
  this.routingHelpers = { animalURL: animalURL, animalPath: animalPath };
}

MockLocomotive.prototype._recordOf = function(obj) {
  if (typeof obj === 'object') { return obj.constructor.name; }
  return null;
}

/* MockRequest */

function MockRequest() {
}

/* MockResponse */

function MockResponse(fn) {
}

/* util */

function augment(a, b) {
  for (var method in b) {
    a[method] = b[method];
  }
}


vows.describe('URLDynamicHelpers').addBatch({
  
  'request handling': {
    topic: function() {
      var app = new MockLocomotive();
      var req = new MockRequest();
      req.headers = { 'host': 'www.example.com' };
      req._locomotive = {};
      req._locomotive.app = app;
      req._locomotive.controller = 'TestController';
      req._locomotive.action = 'show';
      var res = new MockResponse();
      var view = new Object();
      var dynHelpers = {};
      for (var key in dynamicHelpers) {
        dynHelpers[key] = dynamicHelpers[key].call(this, req, res);
      }
      var routingHelpers = {};
      for (var key in app.routingHelpers) {
        routingHelpers[key] = app.routingHelpers[key].bind(view);
      }
      
      augment(view, helpers);
      augment(view, dynHelpers);
      augment(view, routingHelpers);
      return view;
    },
    
    'urlFor': {
      topic: function(view) {
        return view;
      },
      
      'should build correct url for request controller': function (view) {
        assert.isFunction(view.urlFor);
        assert.equal(view.urlFor({ action: 'index' }), 'http://www.example.com/test');
      },
      'should build correct path-only url for request controller': function (view) {
        assert.isFunction(view.urlFor);
        assert.equal(view.urlFor({ action: 'index', onlyPath: true }), '/test');
      },
      'should build correct url for request controller using protocol and host options': function (view) {
        assert.isFunction(view.urlFor);
        assert.equal(view.urlFor({ action: 'index', protocol: 'https', host: 'www.example.net' }), 'https://www.example.net/test');
      },
      'should build correct url to protocol, host, and pathname': function (view) {
        assert.isFunction(view.urlFor);
        assert.equal(view.urlFor({ protocol: 'https', host: 'www.example.net', pathname: 'welcome' }), 'https://www.example.net/welcome');
      },
      'should build correct url to controller action and id': function (view) {
        assert.isFunction(view.urlFor);
        assert.equal(view.urlFor({ controller: 'animals', action: 'show', id: '1234' }), 'http://www.example.com/animals/1234');
      },
      'should throw error with unknown controller and action': function (view) {
        assert.throws(function() { view.urlFor({ controller: 'unknown', action: 'unknown' }) });
      },
      'should invoke routing helper methods when given an object argument': function (view) {
        function Animal() {};
        var animal = new Animal();
        animal.id = '123';
        assert.equal(view.urlFor(animal), 'http://www.example.com/animals/123');
      },
      'should invoke routing helper methods when given an object argument and onlyPath option': function (view) {
        function Animal() {};
        var animal = new Animal();
        animal.id = '123';
        assert.equal(view.urlFor(animal, { onlyPath: true }), '/animals/123');
      },
      'should throw error when unable to find routing helper for object': function (view) {
        function Dog() {};
        var dog = new Dog();
        assert.throws(function() { view.urlFor(dog) });
      },
      'should throw error when unable to determine record of object': function (view) {
        assert.throws(function() { view.urlFor('invalid-record') });
      },
    },
  },
  
  'request handling without Host header': {
    topic: function() {
      var app = new MockLocomotive();
      var req = new MockRequest();
      req._locomotive = {};
      req._locomotive.app = app;
      req._locomotive.controller = 'TestController';
      req._locomotive.action = 'show';
      var res = new MockResponse();
      var view = new Object();
      var dynHelpers = {};
      for (var key in dynamicHelpers) {
        dynHelpers[key] = dynamicHelpers[key].call(this, req, res);
      }
      
      augment(view, helpers);
      augment(view, dynHelpers);
      return view;
    },
    
    'urlFor': {
      topic: function(view) {
        return view;
      },
    
      'should build correct path-only url for request controller': function (view) {
        assert.isFunction(view.urlFor);
        assert.equal(view.urlFor({ action: 'index' }), '/test');
      },
    },
  },
  
  'request handling with https protocol': {
    topic: function() {
      var app = new MockLocomotive();
      var req = new MockRequest();
      req.protocol = 'https';
      req.headers = { 'host': 'www.example.com' };
      req._locomotive = {};
      req._locomotive.app = app;
      req._locomotive.controller = 'TestController';
      req._locomotive.action = 'show';
      var res = new MockResponse();
      var view = new Object();
      var dynHelpers = {};
      for (var key in dynamicHelpers) {
        dynHelpers[key] = dynamicHelpers[key].call(this, req, res);
      }
      
      augment(view, helpers);
      augment(view, dynHelpers);
      return view;
    },
    
    'urlFor': {
      topic: function(view) {
        return view;
      },
      
      'should build correct https url for request controller': function (view) {
        assert.isFunction(view.urlFor);
        assert.equal(view.urlFor({ action: 'index' }), 'https://www.example.com/test');
      },
    },
  },
  
}).export(module);
