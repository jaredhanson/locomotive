var vows = require('vows');
var assert = require('assert');
//var invoke = require('locomotive/middleware/invoke');

// FIXME: port these tests
return;


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
      
      // OK
      'when invoking a controller and action': {
        topic: function(req, res) {
          var self = this;
          function next(err) {
            self.callback(err, req, res);
          }
          process.nextTick(function() {
            req.invoke('foo', 'bar', next)
          });
        },
        
        'should invoke correct controller and action': function(err, req, res) {
          assert.equal(req.invokedController, 'FooController');
          assert.equal(req.invokedAction, 'bar');
        },
      },
      
      // OK
      'when invoking a namespaced controller and action': {
        topic: function(req, res) {
          var self = this;
          function next(err) {
            self.callback(err, req, res);
          }
          process.nextTick(function() {
            req.invoke('admin/foo', 'bar', next)
          });
        },
        
        'should invoke correct controller and action': function(err, req, res) {
          assert.equal(req.invokedController, 'Admin::FooController');
          assert.equal(req.invokedAction, 'bar');
        },
      },
      
      // OK
      'when invoking a controller and action using shorthand': {
        topic: function(req, res) {
          var self = this;
          function next(err) {
            self.callback(err, req, res);
          }
          process.nextTick(function() {
            req.invoke('lorem#ipsum', next)
          });
        },
        
        'should invoke correct controller and action': function(err, req, res) {
          assert.equal(req.invokedController, 'LoremController');
          assert.equal(req.invokedAction, 'ipsum');
        },
      },
    },
  },
  
  'middleware with name option': {
    topic: function() {
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
