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
  this.done = fn;
}

MockResponse.prototype.render = function(view) {
  this._view = view;
  this.end();
}

MockResponse.prototype.local = function(name, val) {
  this._locals.push({ name: name, val: val });
}

MockResponse.prototype.end = function() {
  this.done();
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
      TestController._init({ name: 'foo' }, 'CoolThingsController');
      return TestController;
    },
    
    'should assign controller app property': function(controller) {
      assert.isObject(controller.__app);
      assert.equal(controller.__app.name, 'foo');
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
      TestController._init({ name: 'foo' }, 'TestController');
      
      TestController.home = function() {
        this.render();
      }
      
      TestController.showOnTheRoad = function() {
        this.title = 'On The Road';
        this.author = 'Jack Kerouac';
        this.render();
      }
      
      TestController.showBook = function() {
        this.id = this.param('id');
        this.fullText = this.param('full_text', 'true');
        this.render();
      }
      
      TestController.renderWithFormat = function() {
        this.render({ format: 'xml' });
      }
      
      TestController.renderWithEngine = function() {
        this.render({ engine: 'haml' });
      }
      
      TestController.renderTemplate = function() {
        this.render('show');
      }
      
      TestController.renderTemplatePath = function() {
        this.render('other/show');
      }
      
      TestController.renderTemplateWithFormat = function() {
        this.render('show', { format: 'json' });
      }
      
      TestController.redirectHome = function() {
        this.redirect('/home');
      }
      
      TestController.redirectHomeWithStatus = function() {
        this.redirect('/home', 303);
      }
      
      TestController.internalError = function() {
        this.error(new Error('something went wrong'));
      }
      
      var instance = Object.create(TestController);
      return instance;
    },
    
    'invoking an action': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(null, controller, req, res);
        });
        controller._prepare(req, res);
        controller._invoke('home');
      },
      
      'should assign properties to req': function(err, c, req, res) {
        assert.isObject(req.locomotive);
        assert.equal(req.locomotive.name, 'foo');
        assert.equal(req.controller, 'TestController');
        assert.equal(req.action, 'home');
      },
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
        assert.lengthOf(res._locals, 2);
        assert.equal(res._locals[0].name, 'title');
        assert.equal(res._locals[0].val, 'On The Road');
        assert.equal(res._locals[1].name, 'author');
        assert.equal(res._locals[1].val, 'Jack Kerouac');
      },
      'should render view': function(err, c, req, res) {
        assert.equal(res._view, 'test/show_on_the_road.html.ejs');
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
        controller._invoke('showBook');
      },
      
      'should assign controller properties as response locals': function(err, c, req, res) {
        assert.lengthOf(res._locals, 2);
        assert.equal(res._locals[0].name, 'id');
        assert.equal(res._locals[0].val, '123456');
        assert.equal(res._locals[1].name, 'fullText');
        assert.equal(res._locals[1].val, 'true');
      },
      'should render view': function(err, c, req, res) {
        assert.equal(res._view, 'test/show_book.html.ejs');
      },
    },
    
    'invoking an action which renders with format option': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        
        controller._prepare(req, res);
        controller._invoke('renderWithFormat');
      },
      
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/render_with_format.xml.ejs');
      },
    },
    
    'invoking an action which renders with engine option': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        
        controller._prepare(req, res);
        controller._invoke('renderWithEngine');
      },
      
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/render_with_engine.html.haml');
      },
    },
    
    'invoking an action which renders template': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        
        controller._prepare(req, res);
        controller._invoke('renderTemplate');
      },
      
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/show.html.ejs');
      },
    },
    
    'invoking an action which renders template path': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        
        controller._prepare(req, res);
        controller._invoke('renderTemplatePath');
      },
      
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'other/show.html.ejs');
      },
    },
    
    'invoking an action which renders template with format option': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        
        controller._prepare(req, res);
        controller._invoke('renderTemplateWithFormat');
      },
      
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/show.json.ejs');
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
        controller._invoke('redirectHomeWithStatus');
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
        controller._invoke('internalError');
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
