var vows = require('vows');
var assert = require('assert');
var invoke = require('locomotive/middleware/invoke');


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


vows.describe('invoke').addBatch({

  'middleware': {
    topic: function() {
      // mock
      return invoke().bind(new MockLocomotive());
    },
    
    'when handling a request': {
      topic: function(invoke) {
        var self = this;
        var req = new MockRequest();
        var res = new MockResponse();
        
        function next(err) {
          self.callback(err, req, res);
        }
        process.nextTick(function () {
          invoke(req, res, next)
        });
      },
      
      'should not error' : function(err, req, res) {
        assert.isNull(err);
      },
      'should expose invoke on req' : function(err, req, res) {
        assert.isFunction(req.invoke);
      },
    },
  },
  
  'middleware with name option': {
    topic: function() {
      // mock
      return invoke({ name: 'invokeit' }).bind(new MockLocomotive());
    },
    
    'when handling a request': {
      topic: function(invoke) {
        var self = this;
        var req = new MockRequest();
        var res = new MockResponse();
        
        function next(err) {
          self.callback(err, req, res);
        }
        process.nextTick(function () {
          invoke(req, res, next)
        });
      },
      
      'should not error' : function(err, req, res) {
        assert.isNull(err);
      },
      'should expose invokeit on req' : function(err, req, res) {
        assert.isFunction(req.invokeit);
      },
    },
  },
  
}).export(module);
