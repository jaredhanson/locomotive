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
  
  'controller registration': {
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
    'should register controllers with underscore names without controller suffix in directory': function (locomotive) {
      var TestController = new Controller();
      locomotive.controller('baz/foo_bar', TestController);
      assert.equal(TestController.__name, 'Baz::FooBarController');
    },
    'should register controllers with underscore names with controller suffix in directory': function (locomotive) {
      var TestController = new Controller();
      locomotive.controller('baz/foo_bar_controller', TestController);
      assert.equal(TestController.__name, 'Baz::FooBarController');
    },
  },
  
  'helper registration': {
    topic: function() {
      var app = new locomotive.Locomotive();
      app.helper('loremIpsum', function(){});
      return app;
    },
    
    'should register helper': function (app) {
      assert.lengthOf(Object.keys(app._helpers), 1);
      assert.isFunction(app._helpers.loremIpsum);
    },
  },
  
  'multiple helper registration': {
    topic: function() {
      var app = new locomotive.Locomotive();
      var helpers = {};
      helpers.loremIpsum = function() {};
      helpers.dolorSit = function() {};
      
      app.helpers(helpers);
      return app;
    },
    
    'should register helper': function (app) {
      assert.lengthOf(Object.keys(app._helpers), 2);
      assert.isFunction(app._helpers.loremIpsum);
      assert.isFunction(app._helpers.dolorSit);
    },
  },
  
  'dynamic helper registration': {
    topic: function() {
      var app = new locomotive.Locomotive();
      app.dynamicHelper('loremIpsum', function(req, res){});
      return app;
    },
    
    'should register helper': function (app) {
      assert.lengthOf(Object.keys(app._dynamicHelpers), 1);
      assert.isFunction(app._dynamicHelpers.loremIpsum);
    },
  },
  
  'multiple dynamic helper registration': {
    topic: function() {
      var app = new locomotive.Locomotive();
      var helpers = {};
      helpers.loremIpsum = function(req, res) {};
      helpers.dolorSit = function(req, res) {};
      
      app.dynamicHelpers(helpers);
      return app;
    },
    
    'should register helper': function (app) {
      assert.lengthOf(Object.keys(app._dynamicHelpers), 2);
      assert.isFunction(app._dynamicHelpers.loremIpsum);
      assert.isFunction(app._dynamicHelpers.dolorSit);
    },
  },
  
  'helper and dynamic helper registration': {
    topic: function() {
      var app = new locomotive.Locomotive();
      var helpers = {};
      helpers.loremIpsum = function() {};
      helpers.dolorSit = function() {};
      helpers.dynamic = {};
      helpers.dynamic.latinPhrases = function(req, res) {};
      
      app.helpers(helpers);
      return app;
    },
    
    'should register helpers': function (app) {
      assert.lengthOf(Object.keys(app._helpers), 2);
      assert.isFunction(app._helpers.loremIpsum);
      assert.isFunction(app._helpers.dolorSit);
    },
    'should register dynamic helpers': function (app) {
      assert.lengthOf(Object.keys(app._dynamicHelpers), 1);
      assert.isFunction(app._dynamicHelpers.latinPhrases);
    },
  },
  
}).export(module);
