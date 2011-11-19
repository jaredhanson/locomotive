var vows = require('vows');
var assert = require('assert');
var util = require('util');
var Route = require('locomotive/route');


vows.describe('Route').addBatch({
  
  'route without placeholders': {
    topic: function() {
      return new Route('get', '/account');
    },
    
    'should have method property': function (route) {
      assert.equal(route.method, 'get');
    },
    'should have pattern property': function (route) {
      assert.equal(route.pattern, '/account');
    },
    'should build correct path': function (route) {
      assert.equal(route.path(), '/account');
    },
  },
  
  'route with one placeholder': {
    topic: function() {
      return new Route('get', '/user/:id');
    },
    
    'should build correct path': function (route) {
      assert.equal(route.path({ id: 1234 }), '/user/1234');
    },
  },
  
  'route with one placeholder followed by a segment': {
    topic: function() {
      return new Route('get', '/user/:id/profile');
    },
    
    'should build correct path': function (route) {
      assert.equal(route.path({ id: 1234 }), '/user/1234/profile');
    },
  },
  
  'route with two placeholders': {
    topic: function() {
      return new Route('get', '/user/:id/:name');
    },
    
    'should build correct path': function (route) {
      assert.equal(route.path({ id: 1234, name: 'jared-hanson' }), '/user/1234/jared-hanson');
    },
  },
  
  'route with an optional placeholder led by dot': {
    topic: function() {
      return new Route('get', '/products.:format?');
    },
    
    'should build correct path when placeholder is not in options': function (route) {
      assert.equal(route.path({}), '/products');
    },
    'should build correct path when placeholder is in options': function (route) {
      assert.equal(route.path({ format: 'json' }), '/products.json');
    },
  },
  
  'route with an optional placeholder led by slash': {
    topic: function() {
      return new Route('get', '/service/:op?');
    },
    
    'should build correct path when placeholder is not in options': function (route) {
      assert.equal(route.path({}), '/service');
    },
    'should build correct path when placeholder is in options': function (route) {
      assert.equal(route.path({ op: 'edit' }), '/service/edit');
    },
  },
  
  'route with required placeholder not present in options': {
    topic: function() {
      return new Route('get', '/user/:id');
    },
    
    'should build correct path': function (route) {
      assert.throws(function() { route.path({ xid: 1234 }) });
    },
  },

}).export(module);
