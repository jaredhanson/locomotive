var vows = require('vows');
var assert = require('assert');
var util = require('util');
//var Route = require('locomotive/route');
var dynamicHelpers = require('locomotive/helpers/dynamic');
var helpers = require('locomotive/helpers/url');

// FIXME: Port these tests
return;


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
    // OK
    'should build correct tag with url': function () {
      assert.equal(helpers.linkTo('/account'), '<a href="/account">/account</a>');
    },
    // OK
    'should build correct tag with text and url': function () {
      assert.equal(helpers.linkTo('/account', 'My Account'), '<a href="/account">My Account</a>');
    },
    // OK
    'should build correct tag with text, url, and options': function () {
      assert.equal(helpers.linkTo('/account', 'My Account', { rel: 'me' }), '<a rel="me" href="/account">My Account</a>');
    },
    
    // OK
    'escaping': {
      'should escape URLs with spaces': function () {
        assert.equal(helpers.linkTo('/foo bar/', 'Foo Bar'), '<a href="/foo%20bar/">Foo Bar</a>');
      },
      'should escape test': function () {
        assert.equal(helpers.linkTo('/foo-bar/', 'Foo & Bar'), '<a href="/foo-bar/">Foo &amp; Bar</a>');
        assert.equal(helpers.linkTo('/foo-bar/', 'Foo < Bar'), '<a href="/foo-bar/">Foo &lt; Bar</a>');
        assert.equal(helpers.linkTo('/foo-bar/', 'Foo > Bar'), '<a href="/foo-bar/">Foo &gt; Bar</a>');
        assert.equal(helpers.linkTo('/foo-bar/', '"Foo Bar"'), '<a href="/foo-bar/">&quot;Foo Bar&quot;</a>');
      },
    },
    
    // TODO: port these tests
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
        assert.equal(view.linkTo({ controller: 'profile', action: 'show' }, 'Profile'), '<a href="http://www.example.com/profile">Profile</a>');
        assert.equal(view.linkTo({ controller: 'profile', action: 'show' }, 'Profile', { rel: 'me' }), '<a rel="me" href="http://www.example.com/profile">Profile</a>');
        assert.equal(view.linkTo({ controller: 'ProfileController', action: 'show' }, 'Profile'), '<a href="http://www.example.com/profile">Profile</a>');
        assert.equal(view.linkTo({ controller: 'ProfileController', action: 'show' }, 'Profile', { rel: 'me' }), '<a rel="me" href="http://www.example.com/profile">Profile</a>');
      },
      'should construct link to resource': function (view) {
        function Animal() {};
        var animal = new Animal();
        animal.id = '123';
        
        assert.equal(view.linkTo(animal, 'An Animal'), '<a href="http://www.example.com/animals/123">An Animal</a>');
        assert.equal(view.linkTo(animal, 'An Animal', { rel: 'pet' }), '<a rel="pet" href="http://www.example.com/animals/123">An Animal</a>');
      },
    },
  },
  
  // OK
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
    
    // OK
    'escaping': {
      'should escape URLs with spaces': function () {
        assert.equal(helpers.mailTo('john doe@example.com', 'John Doe'), '<a href="mailto:john%20doe@example.com">John Doe</a>');
      },
      'should escape test': function () {
        assert.equal(helpers.mailTo('parents@example.com', 'Mom & Dad'), '<a href="mailto:parents@example.com">Mom &amp; Dad</a>');
      },
    },
  },
  
}).export(module);
