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
  
  // TODO: Port or remove these test cases
  /*
  'controller registration': {
    topic: function() {
      return new locomotive.Locomotive();
    },
    
    'should register controllers with underscore names without controller suffix': function (locomotive) {
      var TestController = new Controller();
      locomotive.controller('foo_bar', TestController);
      assert.equal(TestController.__name, 'FooBarController');
      assert.equal(TestController.__viewDir, 'foo_bar');
    },
    'should register controllers with underscore names with controller suffix': function (locomotive) {
      var TestController = new Controller();
      locomotive.controller('foo_bar_controller', TestController);
      assert.equal(TestController.__name, 'FooBarController');
      assert.equal(TestController.__viewDir, 'foo_bar');
    },
    'should register controllers with capitalized camelcase names without controller suffix': function (locomotive) {
      var TestController = new Controller();
      locomotive.controller('Foo', TestController);
      assert.equal(TestController.__name, 'FooController');
      assert.equal(TestController.__viewDir, 'foo');
    },
    'should register controllers with capitalized camelcase names with controller suffix': function (locomotive) {
      var TestController = new Controller();
      locomotive.controller('FooController', TestController);
      assert.equal(TestController.__name, 'FooController');
      assert.equal(TestController.__viewDir, 'foo');
    },
    'should register controllers with non-capitalized camelcase names without controller suffix': function (locomotive) {
      var TestController = new Controller();
      locomotive.controller('fooBar', TestController);
      assert.equal(TestController.__name, 'FooBarController');
      assert.equal(TestController.__viewDir, 'foo_bar');
    },
    'should register controllers with non-capitalized camelcase names with controller suffix': function (locomotive) {
      var TestController = new Controller();
      locomotive.controller('fooBarController', TestController);
      assert.equal(TestController.__name, 'FooBarController');
      assert.equal(TestController.__viewDir, 'foo_bar');
    },
    'should register controllers with underscore names without controller suffix in directory': function (locomotive) {
      var TestController = new Controller();
      locomotive.controller('baz/foo_bar', TestController);
      assert.equal(TestController.__name, 'Baz::FooBarController');
      assert.equal(TestController.__viewDir, 'baz/foo_bar');
    },
    'should register controllers with underscore names with controller suffix in directory': function (locomotive) {
      var TestController = new Controller();
      locomotive.controller('baz/foo_bar_controller', TestController);
      assert.equal(TestController.__name, 'Baz::FooBarController');
      assert.equal(TestController.__viewDir, 'baz/foo_bar');
    },
  },
  */
  
  'format registration': {
    topic: function() {
      var app = new locomotive.Locomotive();
      return app;
    },
    
    'should register format to engine as string argument': function (app) {
      app.format('json', 'jsonb');
      assert.lengthOf(Object.keys(app._formats), 1);
      assert.isObject(app._formats['json']);
      assert.equal(app._formats['json'].engine, 'jsonb');
    },
    'should register format to engine as engine option': function (app) {
      app.format('xml', { engine: 'xmlb' });
      assert.lengthOf(Object.keys(app._formats), 2);
      assert.isObject(app._formats['xml']);
      assert.equal(app._formats['xml'].engine, 'xmlb');
    },
    'should register format to engine as extension option': function (app) {
      app.format('html', { extension: '.jade' });
      assert.lengthOf(Object.keys(app._formats), 3);
      assert.isObject(app._formats['html']);
      assert.equal(app._formats['html'].extension, '.jade');
      assert.isUndefined(app._formats['html'].engine);
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
