var vows = require('vows');
var assert = require('assert');
var Controller = require('locomotive/controller');


function MockLocomotive() {
  this._routes = new Object();
  this._routes._handle = function(controller, action) {
    return function(req, res, next) {
      req.invokedController = controller;
      req.invokedAction = action;
      next();
    }
  }
}

function MockRequest() {
}

function MockResponse() {
}

vows.describe('Controller.invoke').addBatch({

  'controller instance': {
    topic: function() {
      var TestController = new Controller();
      TestController._init(new MockLocomotive(), 'TestController');
      TestController.invokeWithShorthand = function() {
        this.invoke('lorem#ipsum');
      }
      TestController.invokeWithControllerAndActionArguments = function() {
        this.invoke('foo', 'bar');
      }
      TestController.invokeWithSlashNamespacedControllerAndActionArguments = function() {
        this.invoke('admin/foo', 'bar');
      }
      TestController.invokeWithActionArgument = function() {
        this.invoke('other');
      }
      
      var instance = Object.create(TestController);
      return instance;
    },
    
    'invoking an action that invokes with shorthand': {
      topic: function(controller) {
        var self = this;
        var req = new MockRequest();
        var res = new MockResponse();
        controller._prepare(req, res, function(err) {
          self.callback(err, req, res);
        });
        controller._invoke('invokeWithShorthand');
      },
      
      'should not error' : function(err, req, res) {
        assert.isNull(err);
      },
      'should invoke correct controller and action': function(err, req, res) {
        assert.equal(req.invokedController, 'LoremController');
        assert.equal(req.invokedAction, 'ipsum');
      },
    },
    
    'invoking an action that invokes with controller and action arguments': {
      topic: function(controller) {
        var self = this;
        var req = new MockRequest();
        var res = new MockResponse();
        controller._prepare(req, res, function(err) {
          self.callback(err, req, res);
        });
        controller._invoke('invokeWithControllerAndActionArguments');
      },
      
      'should not error' : function(err, req, res) {
        assert.isNull(err);
      },
      'should invoke correct controller and action': function(err, req, res) {
        assert.equal(req.invokedController, 'FooController');
        assert.equal(req.invokedAction, 'bar');
      },
    },
    
    'invoking an action that invokes with slash namespaced controller and action arguments': {
      topic: function(controller) {
        var self = this;
        var req = new MockRequest();
        var res = new MockResponse();
        controller._prepare(req, res, function(err) {
          self.callback(err, req, res);
        });
        controller._invoke('invokeWithSlashNamespacedControllerAndActionArguments');
      },
      
      'should not error' : function(err, req, res) {
        assert.isNull(err);
      },
      'should invoke correct controller and action': function(err, req, res) {
        assert.equal(req.invokedController, 'Admin::FooController');
        assert.equal(req.invokedAction, 'bar');
      },
    },
    
    'invoking an action that invokes with action argument': {
      topic: function(controller) {
        var self = this;
        var req = new MockRequest();
        var res = new MockResponse();
        controller._prepare(req, res, function(err) {
          self.callback(err, req, res);
        });
        controller._invoke('invokeWithActionArgument');
      },
      
      'should not error' : function(err, req, res) {
        assert.isNull(err);
      },
      'should invoke correct controller and action': function(err, req, res) {
        assert.equal(req.invokedController, 'TestController');
        assert.equal(req.invokedAction, 'other');
      },
    },
  },

}).export(module);
