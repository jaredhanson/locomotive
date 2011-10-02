var vows = require('vows');
var assert = require('assert');
var util = require('util');
var Controller = require('locomotive/controller');


/* MockRequest */

function MockRequest() {
}


/* MockResponse */

function MockResponse(fn) {
  this._locals = [];
  this._endFn = fn;
}

MockResponse.prototype.render = function() {
  this.end();
}

MockResponse.prototype.local = function(name, val) {
  this._locals.push({ name: name, val: val });
}

MockResponse.prototype.end = function() {
  this._endFn();
}




vows.describe('Controller').addBatch({
  
  'controller': {
    topic: function() {
      return new Controller();
    },
    
    'should have pre and post hooks': function (controller) {
      assert.isFunction(controller.pre);
      assert.isFunction(controller.post);
    },
  },
  
  'controller instance': {
    topic: function() {
      var TestController = new Controller();
      // TODO: Refactor controller naming.
      TestController._name = 'test';
      
      TestController.show = function() {
        this.title = 'The Foo Is Barred';
        this.author = 'Neckbeard';
        this.render();
      }
      
      var instance = Object.create(TestController);
      return instance;
    },
    
    'invoking show': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(null, controller, req, res);
        });
        controller._prepare(req, res);
        controller._invoke('show');
      },
      
      'should assign controller properties as response locals': function(err, c, req, res) {
        assert.length(res._locals, 2);
        assert.equal(res._locals[0].name, 'title');
        assert.equal(res._locals[0].val, 'The Foo Is Barred');
        assert.equal(res._locals[1].name, 'author');
        assert.equal(res._locals[1].val, 'Neckbeard');
      },
    },
  },
  
}).export(module);
