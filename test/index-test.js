var vows = require('vows');
var assert = require('assert');
var locomotive = require('locomotive');
var util = require('util');
var Controller = require('locomotive/controller');


vows.describe('Module').addBatch({
  
  'module': {
    'should report a version': function (x) {
      assert.isString(locomotive.version);
    },
  },
  
  'locomotive': {
    topic: function() {
      return new locomotive.Locomotive();
    },
    
    'should register controllers with underscore names without controller suffix': function (locomotive) {
      var TestController = new Controller();
      locomotive.controller('foo_bar', TestController);
      assert.equal(TestController.__name, 'FooBarController');
    },
    'should register controllers with underscore names with controller suffix': function (locomotive) {
      var TestController = new Controller();
      locomotive.controller('foo_bar_controller', TestController);
      assert.equal(TestController.__name, 'FooBarController');
    },
    'should register controllers with capitalized camelcase names without controller suffix': function (locomotive) {
      var TestController = new Controller();
      locomotive.controller('Foo', TestController);
      assert.equal(TestController.__name, 'FooController');
    },
    'should register controllers with capitalized camelcase names with controller suffix': function (locomotive) {
      var TestController = new Controller();
      locomotive.controller('FooController', TestController);
      assert.equal(TestController.__name, 'FooController');
    },
    'should register controllers with non-capitalized camelcase names without controller suffix': function (locomotive) {
      var TestController = new Controller();
      locomotive.controller('fooBar', TestController);
      assert.equal(TestController.__name, 'FooBarController');
    },
    'should register controllers with non-capitalized camelcase names with controller suffix': function (locomotive) {
      var TestController = new Controller();
      locomotive.controller('fooBarController', TestController);
      assert.equal(TestController.__name, 'FooBarController');
    },
  },
  
}).export(module);
