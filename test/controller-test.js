var vows = require('vows');
var assert = require('assert');
var util = require('util');
var Controller = require('locomotive/controller');
var ControllerError = require('locomotive/errors/controllererror');


/* MockRequest */

function MockRequest() {
  this._params = {};
}

MockRequest.prototype.param = function(name, defaultValue) {
  return this._params[name] || defaultValue;
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
  
  'controller initialization': {
    topic: function() {
      var TestController = new Controller();
      TestController._init('CoolThingsController');
      return TestController;
    },
    
    'should assign controller name property': function(controller) {
      assert.equal(controller.__name, 'CoolThingsController');
    },
    'should assign controller viewDir property': function(controller) {
      assert.equal(controller.__viewDir, 'cool_things');
    },
  },
  
  'controller instance': {
    topic: function() {
      var TestController = new Controller();
      TestController._init('TestController');
      
      TestController.showOnTheRoad = function() {
        this.title = 'On The Road';
        this.author = 'Jack Kerouac';
        this.render();
      }
      
      TestController.showBookById = function() {
        this.id = this.param('id');
        this.fullText = this.param('full_text', 'true');
        this.render();
      }
      
      TestController.redirectHome = function() {
        this.redirect('/home');
      }
      
      TestController.redirectHome303 = function() {
        this.redirect('/home', 303);
      }
      
      TestController.somethingGoesWrong = function() {
        this.error(new Error('something goes wrong'));
      }
      
      var instance = Object.create(TestController);
      return instance;
    },
    
    'invoking an action which sets properties and renders': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(null, controller, req, res);
        });
        controller._prepare(req, res);
        controller._invoke('showOnTheRoad');
      },
      
      'should assign controller properties as response locals': function(err, c, req, res) {
        assert.length(res._locals, 2);
        assert.equal(res._locals[0].name, 'title');
        assert.equal(res._locals[0].val, 'On The Road');
        assert.equal(res._locals[1].name, 'author');
        assert.equal(res._locals[1].val, 'Jack Kerouac');
      },
    },
    
    'invoking an action which checks params, sets properties, and renders': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        req._params['id'] = '123456';
        res = new MockResponse(function() {
          self.callback(null, controller, req, res);
        });
        controller._prepare(req, res);
        controller._invoke('showBookById');
      },
      
      'should assign controller properties as response locals': function(err, c, req, res) {
        assert.length(res._locals, 2);
        assert.equal(res._locals[0].name, 'id');
        assert.equal(res._locals[0].val, '123456');
        assert.equal(res._locals[1].name, 'fullText');
        assert.equal(res._locals[1].val, 'true');
      },
    },
    
    'invoking an action which redirects': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(new Error('should not be called'));
        });
        res.redirect = function(url, status) {
          self.callback(null, url, status);
        }
        
        controller._prepare(req, res);
        controller._invoke('redirectHome');
      },
      
      'should redirect': function(err, url, status) {
        assert.equal(url, '/home');
        assert.isUndefined(status);
      },
    },
    
    'invoking an action which redirects with a status code': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(new Error('should not be called'));
        });
        res.redirect = function(url, status) {
          self.callback(null, url, status);
        }
        
        controller._prepare(req, res);
        controller._invoke('redirectHome303');
      },
      
      'should redirect': function(err, url, status) {
        assert.equal(url, '/home');
        assert.equal(status, 303);
      },
    },
    
    'invoking an action which encounters an error': {
      topic: function(controller) {
        var self = this;
        var req, res, next;
        
        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(new Error('should not be called'));
        });
        next = function(err) {
          self.callback(null, err);
        }
        
        controller._prepare(req, res, next);
        controller._invoke('somethingGoesWrong');
      },
      
      'should not send response' : function(err, e) {
        assert.isNull(err);
      },
      'should call next with error': function(err, e) {
        assert.instanceOf(e, Error);
      },
    },
    
    'invoking an action which does not exist': {
      topic: function(controller) {
        var self = this;
        var req, res, next;
        
        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(new Error('should not be called'));
        });
        next = function(err) {
          self.callback(null, err);
        }
        
        controller._prepare(req, res, next);
        controller._invoke('unknown');
      },
      
      'should not send response' : function(err, e) {
        assert.isNull(err);
      },
      'should call next with error': function(err, e) {
        assert.instanceOf(e, ControllerError);
      },
    },
  },
  
}).export(module);
