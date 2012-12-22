var vows = require('vows');
var assert = require('assert');
var handle = require('locomotive/middleware/handle');


function MockController() {
}

MockController.prototype._init = function(req, res, next) {
  this.req = req;
  this.res = res;
  this.next = next;
}

MockController.prototype._invoke = function(action) {
  this.req.action = action;
  this.next();
}

function MockRequest() {
}

function MockResponse() {
}


vows.describe('handle').addBatch({

  'middleware': {
    topic: function() {
      // mock
      var app = new Object();
      app.controller = function(name) {
        return new MockController();
      }
    
      return handle('foo', 'bar').bind(app);
    },
    
    'when handling a request': {
      topic: function(handle) {
        var self = this;
        var req = new MockRequest();
        var res = new MockResponse();
        
        function next(err) {
          self.callback(err, req, res);
        }
        process.nextTick(function () {
          handle(req, res, next)
        });
      },
      
      'should not error' : function(err, req, res) {
        assert.isNull(err);
      },
      'should invoke action' : function(err, req, res) {
        assert.equal(req.action, 'bar');
      },
    },
  },
  
  'middleware bound to unknown controller': {
    topic: function() {
      // mock
      var app = new Object();
      app.controller = function(name) {
        return undefined;
      }
    
      return handle('foo', 'bar').bind(app);
    },
    
    'when handling a request': {
      topic: function(handle) {
        var self = this;
        var req = new MockRequest();
        var res = new MockResponse();
        
        function next(err) {
          self.callback(err, req, res);
        }
        process.nextTick(function () {
          handle(req, res, next)
        });
      },
      
      'should error' : function(err, req, res) {
        assert.isNotNull(err);
        assert.equal(err.name, 'RouterError');
      },
      'should not invoke action' : function(err, req, res) {
        assert.isUndefined(req.action);
      },
    },
  },

}).export(module);
