var vows = require('vows');
var assert = require('assert');
var util = require('util');
var Route = require('locomotive/route');
var dynamicHelpers = require('locomotive/helpers/dynamic');
var helpers = require('locomotive/helpers/url');


/* MockLocomotive */

function MockLocomotive() {
  var self = this;
  this._routes = {};
  this._routes['AnimalsController#show'] = new Route('get', '/animals/:id');
  this._routes['ProfileController#show'] = new Route('get', '/profile');
  this._routes.find = function(controller, action) {
    var key = controller + '#' + action;
    return self._routes[key];
  }
  
  function animalURL(obj) {
    return this.urlFor({ controller: 'AnimalsController', action: 'show', id: obj.id });
  }
  this.routingHelpers = { animalURL: animalURL };
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


vows.describe('URLHelpers').addBatch({
  
  'linkTo': {
    'should build correct tag with text and url': function () {
      assert.equal(helpers.linkTo('My Account', '/account'), '<a href="/account">My Account</a>');
    },
    'should build correct tag with text, url, and options': function () {
      assert.equal(helpers.linkTo('My Account', '/account', { rel: 'me' }), '<a rel="me" href="/account">My Account</a>');
    },
    
    'route awareness': {
      topic: function() {
        var app = new MockLocomotive();
        var req = new MockRequest();
        req.headers = { 'host': 'www.example.com' };
        req._locomotive = {};
        req._locomotive.app = app;
        req._locomotive.controller = 'TestController';
        req._locomotive.action = 'index';
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
      
      'should construct link to controller and action': function (view) {
        assert.equal(view.linkTo('Profile', { controller: 'profile', action: 'show' }), '<a href="http://www.example.com/profile">Profile</a>');
        assert.equal(view.linkTo('Profile', { controller: 'profile', action: 'show' }, { rel: 'me' }), '<a rel="me" href="http://www.example.com/profile">Profile</a>');
        assert.equal(view.linkTo('Profile', { controller: 'ProfileController', action: 'show' }), '<a href="http://www.example.com/profile">Profile</a>');
        assert.equal(view.linkTo('Profile', { controller: 'ProfileController', action: 'show' }, { rel: 'me' }), '<a rel="me" href="http://www.example.com/profile">Profile</a>');
      },
      'should construct link to resource': function (view) {
        function Animal() {};
        var animal = new Animal();
        animal.id = '123';
        
        assert.equal(view.linkTo('An Animal', animal), '<a href="http://www.example.com/animals/123">An Animal</a>');
        assert.equal(view.linkTo('An Animal', animal, { rel: 'pet' }), '<a rel="pet" href="http://www.example.com/animals/123">An Animal</a>');
      },
    },
  },
  
  'mailTo': {
    'should build correct tag with email': function () {
      assert.equal(helpers.mailTo('johndoe@example.com'), '<a href="mailto:johndoe@example.com">johndoe@example.com</a>');
    },
    'should build correct tag with email and options': function () {
      assert.equal(helpers.mailTo('johndoe@example.com', { class: 'email' }), '<a class="email" href="mailto:johndoe@example.com">johndoe@example.com</a>');
    },
    'should build correct tag with email and text': function () {
      assert.equal(helpers.mailTo('johndoe@example.com', 'John Doe'), '<a href="mailto:johndoe@example.com">John Doe</a>');
    },
    'should build correct tag with email, text, and options': function () {
      assert.equal(helpers.mailTo('johndoe@example.com', 'John Doe', { class: 'email' }), '<a class="email" href="mailto:johndoe@example.com">John Doe</a>');
    },
  },
  
}).export(module);
