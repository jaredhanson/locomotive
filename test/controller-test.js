var vows = require('vows');
var assert = require('assert');
var util = require('util');
var Controller = require('locomotive/controller');
var ControllerError = require('locomotive/errors/controllererror');


/* MockLocomotive */

function MockLocomotive() {
  this._formats = {};
}

MockLocomotive.prototype.format = function(fmt, options) {
  this._formats[fmt] = options;
}


/* MockRequest */

function MockRequest() {
  this._params = {};
}

MockRequest.prototype.param = function(name, defaultValue) {
  return this._params[name] || defaultValue;
}


/* MockResponse */

function MockResponse(fn) {
  this._headers = {};
  this.locals = {};
  this.done = fn;
}

MockResponse.prototype.render = function(view, options, fn) {
  this._view = view;
  this._options = options;
  this._fn = fn;
  this.end();
}

MockResponse.prototype.setHeader = function(name, value) {
  this._headers[name] = value;
}

MockResponse.prototype.end = function() {
  this.done && this.done();
}


vows.describe('Controller').addBatch({
  
  'controller initialization': {
    topic: function() {
      var TestController = new Controller();
      TestController._load(new MockLocomotive(), 'FooBarController');
      return TestController;
    },
    
    'should assign controller app property': function(controller) {
      assert.instanceOf(controller.__app, MockLocomotive);
    },
    'should assign controller name property': function(controller) {
      assert.equal(controller.__name, 'FooBarController');
    },
    'should assign controller viewDir property': function(controller) {
      assert.equal(controller.__viewDir, 'foo_bar');
    },
  },
  
  'controller instance': {
    topic: function() {
      var TestController = new Controller();
      TestController._load(new MockLocomotive(), 'TestController');
      
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
      
      TestController.renderToCallback = function() {
        this.render(function(err, html) { return 'CB-1' });
      }
      
      TestController.renderTemplateToCallback = function() {
        this.render('show', function(err, html) { return 'CB-2' });
      }
      
      TestController.renderTemplateAndOptionsToCallback = function() {
        this.render('show', { layout: 'email' }, function(err, html) { return 'CB-3' });
      }
      
      TestController.respondWithFunctionUsingMimeKey = function() {
        var self = this;
        this.respond({
          'application/json': function() { self.render({ format: 'json', engine: 'jsonb' }); },
          'application/xml': function() { self.render({ format: 'xml', engine: 'xmlb' }); }
        });
      }
      
      TestController.respondWithFunctionUsingMimeKeyAndDefault = function() {
        var self = this;
        this.respond({
          'application/json': function() { self.render({ format: 'json', engine: 'jsonb' }); },
          'application/xml': function() { self.render({ format: 'xml', engine: 'xmlb' }); },
          default: function() { self.render({ format: 'foo', engine: 'foob' }); }
        });
      }
      
      TestController.respondWithFunctionUsingExtKey = function() {
        var self = this;
        this.respond({
          'json': function() { self.render({ format: 'json', engine: 'jsonb' }); },
          'xml': function() { self.render({ format: 'xml', engine: 'xmlb' }); }
        });
      }
      
      TestController.respondWithFunctionUsingExtKeyAndDefault = function() {
        var self = this;
        this.respond({
          'json': function() { self.render({ format: 'json', engine: 'jsonb' }); },
          'xml': function() { self.render({ format: 'xml', engine: 'xmlb' }); },
          default: function() { self.render({ format: 'foo', engine: 'foob' }); },
        });
      }
      
      TestController.respondWithOptionsUsingMimeKey = function() {
        var self = this;
        this.respond({
          'application/json': { engine: 'jsonb' },
          'application/xml': { template: 'otherxml', engine: 'xmlb' },
          'application/x-foo': { format: 'foo', engine: 'foob' },
        });
      }
      
      TestController.respondWithOptionsUsingMimeKeyAndDefaults = function() {
        var self = this;
        this.respond({
          'application/json': { engine: 'jsonb' },
          'application/xml': { template: 'otherxml', engine: 'xmlb' },
          'application/x-foo': { format: 'foo', engine: 'foob' },
          default: {},
        });
      }
      
      TestController.respondWithOptionsUsingMimeKeyAndDefaultsTrue = function() {
        var self = this;
        this.respond({
          'application/json': { engine: 'jsonb' },
          'application/xml': { template: 'otherxml', engine: 'xmlb' },
          'application/x-foo': { format: 'foo', engine: 'foob' },
          default: true,
        });
      }
      
      TestController.respondWithOptionsUsingMimeKeyAndDefaultsToYAML = function() {
        var self = this;
        this.respond({
          'application/json': { engine: 'jsonb' },
          'application/xml': { template: 'otherxml', engine: 'xmlb' },
          'application/x-foo': { format: 'foo', engine: 'foob' },
          default: { format: 'yaml', engine: 'yamlb' },
        });
      }
      
      TestController.respondWithOptionsUsingExtKey = function() {
        var self = this;
        this.respond({
          'json': { engine: 'jsonb' },
          'xml': { template: 'otherxml', engine: 'xmlb' },
          'foo': { format: 'foo', engine: 'foob' },
        });
      }
      
      TestController.respondWithOptionsUsingExtKeyAndDefaults = function() {
        var self = this;
        this.respond({
          'json': { engine: 'jsonb' },
          'xml': { template: 'otherxml', engine: 'xmlb' },
          'foo': { format: 'foo', engine: 'foob' },
          default: {},
        });
      }
      
      TestController.respondWithOptionsUsingExtKeyAndDefaultsTrue = function() {
        var self = this;
        this.respond({
          'json': { engine: 'jsonb' },
          'xml': { template: 'otherxml', engine: 'xmlb' },
          'foo': { format: 'foo', engine: 'foob' },
          default: true,
        });
      }
      
      TestController.respondWithOptionsUsingExtKeyAndDefaultsToYAML = function() {
        var self = this;
        this.respond({
          'json': { engine: 'jsonb' },
          'xml': { template: 'otherxml', engine: 'xmlb' },
          'foo': { format: 'foo', engine: 'foob' },
          default: { format: 'yaml', engine: 'yamlb' },
        });
      }
      
      TestController.redirectHome = function() {
        this.redirect('/home');
      }
      
      TestController.redirectHomeWithStatus = function() {
        this.redirect(303, '/home');
      }
      
      TestController.redirectHomeWithStatusAsLastArg = function() {
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
        controller._init(req, res);
        controller._invoke('home');
      },
      
      'should assign properties to controller': function(err, c, req, res) {
        assert.isObject(c.app);
        assert.instanceOf(c.app, MockLocomotive);
        assert.isObject(c.req);
        assert.equal(c.req, c.request);
        assert.isObject(c.res);
        assert.equal(c.res, c.response);
      },
      'should assign properties to req': function(err, c, req, res) {
        assert.isObject(req._locomotive);
        assert.instanceOf(req._locomotive.app, MockLocomotive);
        assert.equal(req._locomotive.controller, 'TestController');
        assert.equal(req._locomotive.action, 'home');
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
        controller._init(req, res);
        controller._invoke('showOnTheRoad');
      },
      
      'should assign controller properties as response locals': function(err, c, req, res) {
        assert.lengthOf(Object.keys(res.locals), 2);
        assert.equal(res.locals.title, 'On The Road');
        assert.equal(res.locals.author, 'Jack Kerouac');
      },
      'should render view': function(err, c, req, res) {
        assert.equal(res._view, 'test/show_on_the_road.html.ejs');
      },
      'should not set content-type': function(err, c, req, res) {
        assert.isUndefined(res._headers['Content-Type']);
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
        controller._init(req, res);
        controller._invoke('showBook');
      },
      
      'should assign controller properties as response locals': function(err, c, req, res) {
        assert.lengthOf(Object.keys(res.locals), 2);
        assert.equal(res.locals.id, '123456');
        assert.equal(res.locals.fullText, 'true');
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
        
        controller._init(req, res);
        controller._invoke('renderWithFormat');
      },
      
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/render_with_format.xml.ejs');
      },
      'should set content-type': function(err, req, res) {
        assert.equal(res._headers['Content-Type'], 'application/xml');
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
        
        controller._init(req, res);
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
        
        controller._init(req, res);
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
        
        controller._init(req, res);
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
        
        controller._init(req, res);
        controller._invoke('renderTemplateWithFormat');
      },
      
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/show.json.ejs');
      },
    },
    
    'invoking an action which renders to callback': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        
        controller._init(req, res);
        controller._invoke('renderToCallback');
      },
      
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/render_to_callback.html.ejs');
        assert.lengthOf(Object.keys(res._options), 0);
        assert.isFunction(res._fn);
        assert.equal(res._fn(), 'CB-1');
      },
    },
    
    'invoking an action which renders template to callback': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        
        controller._init(req, res);
        controller._invoke('renderTemplateToCallback');
      },
      
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/show.html.ejs');
        assert.lengthOf(Object.keys(res._options), 0);
        assert.isFunction(res._fn);
        assert.equal(res._fn(), 'CB-2');
      },
    },
    
    'invoking an action which renders template with options to callback': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        
        controller._init(req, res);
        controller._invoke('renderTemplateAndOptionsToCallback');
      },
      
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/show.html.ejs');
        assert.equal(res._options.layout, 'email');
        assert.isFunction(res._fn);
        assert.equal(res._fn(), 'CB-3');
      },
    },
    
    'invoking an action which responds to request that accepts JSON using function and mime types as keys': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        req.params = {};
        req.accepts = function(keys) {
          return 'application/json';
        }
        
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        
        controller._init(req, res);
        controller._invoke('respondWithFunctionUsingMimeKey');
      },
      
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/respond_with_function_using_mime_key.json.jsonb');
      },
      'should set content-type': function(err, req, res) {
        assert.equal(res._headers['Content-Type'], 'application/json');
      },
      'should set vary header': function(err, req, res) {
        assert.equal(res._headers['Vary'], 'Accept');
      },
    },
    
    'invoking an action which responds to request that accepts XML using function and mime types as keys': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        req.params = {};
        req.accepts = function(keys) {
          return 'application/xml';
        }
        
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        
        controller._init(req, res);
        controller._invoke('respondWithFunctionUsingMimeKey');
      },
      
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/respond_with_function_using_mime_key.xml.xmlb');
      },
      'should set content-type': function(err, req, res) {
        assert.equal(res._headers['Content-Type'], 'application/xml');
      },
    },
    
    'invoking an action which responds to request that wants XML by extension using function and mime types as keys': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        req.params = { format: 'xml' };
        req.accepts = function(keys) {
          // format param overrides this
          return 'application/json';
        }
        
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        
        controller._init(req, res);
        controller._invoke('respondWithFunctionUsingMimeKey');
      },
      
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/respond_with_function_using_mime_key.xml.xmlb');
      },
      'should set content-type': function(err, req, res) {
        assert.equal(res._headers['Content-Type'], 'application/xml');
      },
    },
    
    'invoking an action which responds to request that accepts an unsupported format using function and mime types as keys': {
      topic: function(controller) {
        var self = this;
        var req, res, next;
        
        req = new MockRequest();
        req.params = {};
        req.accepts = function(keys) {
          //return 'application/x-foo';
          return undefined;
        }
        next = function(err) {
          self.callback(null, err);
        }
        
        res = new MockResponse(function() {
          self.callback(new Error('should not be called'));
        });
        
        controller._init(req, res, next);
        controller._invoke('respondWithFunctionUsingMimeKey');
      },
      
      'should not send response' : function(err, e) {
        assert.isNull(err);
      },
      'should call next with error': function(err, e) {
        assert.instanceOf(e, Error);
        assert.equal(e.message, 'Not Acceptable');
        assert.equal(e.status, 406);
        assert.lengthOf(e.types, 2);
        assert.equal(e.types[0], 'application/json');
        assert.equal(e.types[1], 'application/xml');
      },
    },
    
    'invoking an action which responds to request that accepts an unsupported format using default function and mime types as keys': {
      topic: function(controller) {
        var self = this;
        var req, res, next;
        
        req = new MockRequest();
        req.params = {};
        req.accepts = function(keys) {
          return undefined;
        }
        next = function(err) {
          self.callback(err);
        }
        
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        
        controller._init(req, res, next);
        controller._invoke('respondWithFunctionUsingMimeKeyAndDefault');
      },
      
      'should not error' : function(err, req, res) {
        assert.isNull(err);
      },
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/respond_with_function_using_mime_key_and_default.foo.foob');
      },
      'should set content-type': function(err, req, res) {
        assert.equal(res._headers['Content-Type'], 'application/octet-stream');
      },
    },
    
    'invoking an action which responds to request that accepts JSON using function and extensions as keys': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        req.params = {};
        req.accepts = function(keys) {
          return 'json';
        }
        
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        
        controller._init(req, res);
        controller._invoke('respondWithFunctionUsingExtKey');
      },
      
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/respond_with_function_using_ext_key.json.jsonb');
      },
      'should set content-type': function(err, req, res) {
        assert.equal(res._headers['Content-Type'], 'application/json');
      },
    },
    
    'invoking an action which responds to request that accepts XML using function and extensions as keys': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        req.params = {};
        req.accepts = function(keys) {
          return 'xml';
        }
        
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        
        controller._init(req, res);
        controller._invoke('respondWithFunctionUsingExtKey');
      },
      
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/respond_with_function_using_ext_key.xml.xmlb');
      },
      'should set content-type': function(err, req, res) {
        assert.equal(res._headers['Content-Type'], 'application/xml');
      },
    },
    
    'invoking an action which responds to request that wants XML by extension using function and extensions as keys': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        req.params = { format: 'xml' };
        req.accepts = function(keys) {
          // format param overrides this
          return 'json';
        }
        
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        
        controller._init(req, res);
        controller._invoke('respondWithFunctionUsingExtKey');
      },
      
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/respond_with_function_using_ext_key.xml.xmlb');
      },
      'should set content-type': function(err, req, res) {
        assert.equal(res._headers['Content-Type'], 'application/xml');
      },
    },
    
    'invoking an action which responds to request that accepts an unsupported format using function and extensions as keys': {
      topic: function(controller) {
        var self = this;
        var req, res, next;
        
        req = new MockRequest();
        req.params = {};
        req.accepts = function(keys) {
          //return 'foo';
          return undefined;
        }
        next = function(err) {
          self.callback(null, err);
        }
        
        res = new MockResponse(function() {
          self.callback(new Error('should not be called'));
        });
        
        controller._init(req, res, next);
        controller._invoke('respondWithFunctionUsingExtKey');
      },
      
      'should not send response' : function(err, e) {
        assert.isNull(err);
      },
      'should call next with error': function(err, e) {
        assert.instanceOf(e, Error);
        assert.equal(e.message, 'Not Acceptable');
        assert.equal(e.status, 406);
        assert.lengthOf(e.types, 2);
        assert.equal(e.types[0], 'application/json');
        assert.equal(e.types[1], 'application/xml');
      },
    },
    
    'invoking an action which responds to request that accepts an unsupported format using default function and extensions as keys': {
      topic: function(controller) {
        var self = this;
        var req, res, next;
        
        req = new MockRequest();
        req.params = {};
        req.accepts = function(keys) {
          return undefined;
        }
        next = function(err) {
          self.callback(err);
        }
        
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        
        controller._init(req, res, next);
        controller._invoke('respondWithFunctionUsingExtKeyAndDefault');
      },
      
      'should not error' : function(err, req, res) {
        assert.isNull(err);
      },
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/respond_with_function_using_ext_key_and_default.foo.foob');
      },
      'should set content-type': function(err, req, res) {
        assert.equal(res._headers['Content-Type'], 'application/octet-stream');
      },
    },
    
    'invoking an action which responds to request that accepts JSON using object and mime types as keys': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        req.params = {};
        req.accepts = function(keys) {
          return 'application/json';
        }
        
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        
        controller._init(req, res);
        controller._invoke('respondWithOptionsUsingMimeKey');
      },
      
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/respond_with_options_using_mime_key.json.jsonb');
      },
      'should set content-type': function(err, req, res) {
        assert.equal(res._headers['Content-Type'], 'application/json');
      },
    },
    
    'invoking an action which responds to request that accepts XML using object and mime types as keys': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        req.params = {};
        req.accepts = function(keys) {
          return 'application/xml';
        }
        
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        
        controller._init(req, res);
        controller._invoke('respondWithOptionsUsingMimeKey');
      },
      
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/otherxml.xml.xmlb');
      },
      'should set content-type': function(err, req, res) {
        assert.equal(res._headers['Content-Type'], 'application/xml');
      },
    },
    
    'invoking an action which responds to request that accepts X-Foo using object and mime types as keys': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        req.params = {};
        req.accepts = function(keys) {
          return 'application/x-foo';
        }
        
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        
        controller._init(req, res);
        controller._invoke('respondWithOptionsUsingMimeKey');
      },
      
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/respond_with_options_using_mime_key.foo.foob');
      },
      'should set content-type': function(err, req, res) {
        assert.equal(res._headers['Content-Type'], 'application/octet-stream');
      },
    },
    
    'invoking an action which responds to request for unsupported type using object and mime types as keys': {
      topic: function(controller) {
        var self = this;
        var req, res, next;
        
        req = new MockRequest();
        req.params = {};
        req.accepts = function(keys) {
          return undefined;
        }
        next = function(err) {
          self.callback(null, err);
        }
        
        res = new MockResponse(function() {
          self.callback(new Error('should not be called'));
        });
        
        controller._init(req, res, next);
        controller._invoke('respondWithOptionsUsingMimeKey');
      },
      
      'should not send response' : function(err, e) {
        assert.isNull(err);
      },
      'should call next with error': function(err, e) {
        assert.instanceOf(e, Error);
        assert.equal(e.message, 'Not Acceptable');
        assert.equal(e.status, 406);
        assert.lengthOf(e.types, 3);
        assert.equal(e.types[0], 'application/json');
        assert.equal(e.types[1], 'application/xml');
        assert.equal(e.types[2], 'application/x-foo');
      },
    },
    
    'invoking an action which responds to request for unsupported type using default object and mime types as keys': {
      topic: function(controller) {
        var self = this;
        var req, res, next;
        
        req = new MockRequest();
        req.params = {};
        req.accepts = function(keys) {
          return undefined;
        }
        next = function(err) {
          self.callback(null, err);
        }
        
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        
        controller._init(req, res, next);
        controller._invoke('respondWithOptionsUsingMimeKeyAndDefaults');
      },
      
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/respond_with_options_using_mime_key_and_defaults.html.ejs');
      },
      'should set content-type': function(err, req, res) {
        assert.isUndefined(res._headers['Content-Type']);
      },
    },
    
    'invoking an action which responds to request for unsupported type using default true and mime types as keys': {
      topic: function(controller) {
        var self = this;
        var req, res, next;
        
        req = new MockRequest();
        req.params = {};
        req.accepts = function(keys) {
          return undefined;
        }
        next = function(err) {
          self.callback(null, err);
        }
        
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        
        controller._init(req, res, next);
        controller._invoke('respondWithOptionsUsingMimeKeyAndDefaultsTrue');
      },
      
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/respond_with_options_using_mime_key_and_defaults_true.html.ejs');
      },
      'should set content-type': function(err, req, res) {
        assert.isUndefined(res._headers['Content-Type']);
      },
    },
    
    'invoking an action which responds to request for unsupported type using default object with YAML format and mime types as keys': {
      topic: function(controller) {
        var self = this;
        var req, res, next;
        
        req = new MockRequest();
        req.params = {};
        req.accepts = function(keys) {
          return undefined;
        }
        next = function(err) {
          self.callback(null, err);
        }
        
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        
        controller._init(req, res, next);
        controller._invoke('respondWithOptionsUsingMimeKeyAndDefaultsToYAML');
      },
      
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/respond_with_options_using_mime_key_and_defaults_to_yaml.yaml.yamlb');
      },
    },
    
    'invoking an action which responds to request that accepts JSON using object and extensions as keys': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        req.params = {};
        req.accepts = function(keys) {
          return 'json';
        }
        
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        
        controller._init(req, res);
        controller._invoke('respondWithOptionsUsingExtKey');
      },
      
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/respond_with_options_using_ext_key.json.jsonb');
      },
      'should set content-type': function(err, req, res) {
        assert.equal(res._headers['Content-Type'], 'application/json');
      },
    },
    
    'invoking an action which responds to request that accepts XML using object and extensions as keys': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        req.params = {};
        req.accepts = function(keys) {
          return 'xml';
        }
        
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        
        controller._init(req, res);
        controller._invoke('respondWithOptionsUsingExtKey');
      },
      
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/otherxml.xml.xmlb');
      },
      'should set content-type': function(err, req, res) {
        assert.equal(res._headers['Content-Type'], 'application/xml');
      },
    },
    
    'invoking an action which responds to request that accepts X-Foo using object and extensions as keys': {
      topic: function(controller) {
        var self = this;
        var req, res, next;
        
        req = new MockRequest();
        req.params = {};
        req.accepts = function(keys) {
          return 'foo';
        }
        next = function(err) {
          self.callback(null, err);
        }
        
        res = new MockResponse(function() {
          self.callback(null, req, res, next);
        });
        
        controller._init(req, res, next);
        controller._invoke('respondWithOptionsUsingExtKey');
      },
      
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/respond_with_options_using_ext_key.foo.foob');
      },
      'should set content-type': function(err, req, res) {
        assert.equal(res._headers['Content-Type'], 'application/octet-stream');
      },
    },
    
    'invoking an action which responds to request for unsupported type using object and extensions as keys': {
      topic: function(controller) {
        var self = this;
        var req, res, next;
        
        req = new MockRequest();
        req.params = {};
        req.accepts = function(keys) {
          return undefined;
        }
        next = function(err) {
          self.callback(null, err);
        }
        
        res = new MockResponse(function() {
          self.callback(new Error('should not be called'));
        });
        
        controller._init(req, res, next);
        controller._invoke('respondWithOptionsUsingExtKey');
      },
      
      'should not send response' : function(err, e) {
        assert.isNull(err);
      },
      'should call next with error': function(err, e) {
        assert.instanceOf(e, Error);
        assert.equal(e.message, 'Not Acceptable');
        assert.equal(e.status, 406);
        assert.lengthOf(e.types, 3);
        assert.equal(e.types[0], 'application/json');
        assert.equal(e.types[1], 'application/xml');
        assert.equal(e.types[2], 'application/octet-stream');
      },
    },
    
    'invoking an action which responds to request for unsupported type using default object and extensions as keys': {
      topic: function(controller) {
        var self = this;
        var req, res, next;
        
        req = new MockRequest();
        req.params = {};
        req.accepts = function(keys) {
          return undefined;
        }
        next = function(err) {
          self.callback(null, err);
        }
        
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        
        controller._init(req, res, next);
        controller._invoke('respondWithOptionsUsingExtKeyAndDefaults');
      },
      
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/respond_with_options_using_ext_key_and_defaults.html.ejs');
      },
      'should set content-type': function(err, req, res) {
        assert.isUndefined(res._headers['Content-Type']);
      },
    },
    
    'invoking an action which responds to request for unsupported type using default true and extensions as keys': {
      topic: function(controller) {
        var self = this;
        var req, res, next;
        
        req = new MockRequest();
        req.params = {};
        req.accepts = function(keys) {
          return undefined;
        }
        next = function(err) {
          self.callback(null, err);
        }
        
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        
        controller._init(req, res, next);
        controller._invoke('respondWithOptionsUsingExtKeyAndDefaultsTrue');
      },
      
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/respond_with_options_using_ext_key_and_defaults_true.html.ejs');
      },
      'should set content-type': function(err, req, res) {
        assert.isUndefined(res._headers['Content-Type']);
      },
    },
    
    'invoking an action which responds to request for unsupported type using default object with YAML format and extensions as keys': {
      topic: function(controller) {
        var self = this;
        var req, res, next;
        
        req = new MockRequest();
        req.params = {};
        req.accepts = function(keys) {
          return undefined;
        }
        next = function(err) {
          self.callback(null, err);
        }
        
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        
        controller._init(req, res, next);
        controller._invoke('respondWithOptionsUsingExtKeyAndDefaultsToYAML');
      },
      
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/respond_with_options_using_ext_key_and_defaults_to_yaml.yaml.yamlb');
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
        res.redirect = function(status, url) {
          self.callback(null, status, url);
        }
        
        controller._init(req, res);
        controller._invoke('redirectHome');
      },
      
      'should redirect': function(err, status, url) {
        assert.equal(status, '/home');
        assert.isUndefined(url);
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
        res.redirect = function(status, url) {
          self.callback(null, status, url);
        }
        
        controller._init(req, res);
        controller._invoke('redirectHomeWithStatus');
      },
      
      'should redirect': function(err, status, url) {
        assert.equal(status, 303);
        assert.equal(url, '/home');
      },
    },
    
    'invoking an action which redirects with a status code as last argument': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(new Error('should not be called'));
        });
        res.redirect = function(status, url) {
          self.callback(null, status, url);
        }
        
        controller._init(req, res);
        controller._invoke('redirectHomeWithStatusAsLastArg');
      },
      
      'should redirect': function(err, status, url) {
        assert.equal(status, 303);
        assert.equal(url, '/home');
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
        
        controller._init(req, res, next);
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
        
        controller._init(req, res, next);
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
  
  'controller instance in app with registered formats': {
    topic: function() {
      var app = new MockLocomotive();
      app.format('html', { extension: 'jade' });
      app.format('xml', { engine: 'xmlb' });
      app.format('foo', { extension: '.bar' });
    
      var TestController = new Controller();
      TestController._load(app, 'TestController');
    
      TestController.renderHTML = function() {
        this.render();
      }
      TestController.renderHTMLWithEngine = function() {
        this.render({ engine: 'dust' });
      }
      TestController.renderHTMLWithExtension = function() {
        this.render({ extension: 'stache' });
      }
      TestController.renderXML = function() {
        this.render({ format: 'xml' });
      }
      TestController.renderXMLWithEngine = function() {
        this.render({ format: 'xml', engine: 'ltxb' });
      }
      TestController.renderXMLWithExtension = function() {
        this.render({ format: 'xml', extension: 'xtxb' });
      }
      TestController.renderXMLWithDotExtension = function() {
        this.render({ format: 'xml', extension: '.dxtxb' });
      }
      TestController.renderFoo = function() {
        this.render({ format: 'foo' });
      }
      
      var instance = Object.create(TestController);
      return instance;
    },
    
    'rendering HTML using application engine': {
      topic: function(controller) {
        var self = this;
        var req, res, next;

        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        next = function(err) {
          self.callback(err, null, null);
        }

        controller._init(req, res, next);
        controller._invoke('renderHTML');
      },

      'should not error': function(err, req, res) {
        assert.isNull(err);
      },
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/render_html.jade');
      },
      'should not set content-type': function(err, req, res) {
        assert.isUndefined(res._headers['Content-Type']);
      },
    },
    
    'rendering HTML using override engine': {
      topic: function(controller) {
        var self = this;
        var req, res, next;

        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        next = function(err) {
          self.callback(err, null, null);
        }

        controller._init(req, res, next);
        controller._invoke('renderHTMLWithEngine');
      },

      'should not error': function(err, req, res) {
        assert.isNull(err);
      },
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/render_html_with_engine.html.dust');
      },
      'should not set content-type': function(err, req, res) {
        assert.isUndefined(res._headers['Content-Type']);
      },
    },
    
    'rendering HTML using override extension': {
      topic: function(controller) {
        var self = this;
        var req, res, next;

        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        next = function(err) {
          self.callback(err, null, null);
        }

        controller._init(req, res, next);
        controller._invoke('renderHTMLWithExtension');
      },

      'should not error': function(err, req, res) {
        assert.isNull(err);
      },
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/render_html_with_extension.stache');
      },
      'should not set content-type': function(err, req, res) {
        assert.isUndefined(res._headers['Content-Type']);
      },
    },
    
    'rendering XML using application engine': {
      topic: function(controller) {
        var self = this;
        var req, res, next;

        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        next = function(err) {
          self.callback(err, null, null);
        }

        controller._init(req, res, next);
        controller._invoke('renderXML');
      },

      'should not error': function(err, req, res) {
        assert.isNull(err);
      },
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/render_xml.xml.xmlb');
      },
      'should set content-type': function(err, req, res) {
        assert.equal(res._headers['Content-Type'], 'application/xml');
      },
    },
    
    'rendering XML using override engine': {
      topic: function(controller) {
        var self = this;
        var req, res, next;

        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        next = function(err) {
          self.callback(err, null, null);
        }

        controller._init(req, res, next);
        controller._invoke('renderXMLWithEngine');
      },

      'should not error': function(err, req, res) {
        assert.isNull(err);
      },
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/render_xml_with_engine.xml.ltxb');
      },
      'should set content-type': function(err, req, res) {
        assert.equal(res._headers['Content-Type'], 'application/xml');
      },
    },
    
    'rendering XML using override extension': {
      topic: function(controller) {
        var self = this;
        var req, res, next;

        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        next = function(err) {
          self.callback(err, null, null);
        }

        controller._init(req, res, next);
        controller._invoke('renderXMLWithExtension');
      },

      'should not error': function(err, req, res) {
        assert.isNull(err);
      },
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/render_xml_with_extension.xtxb');
      },
      'should set content-type': function(err, req, res) {
        assert.equal(res._headers['Content-Type'], 'application/xml');
      },
    },
    
    'rendering XML using override dot extension': {
      topic: function(controller) {
        var self = this;
        var req, res, next;

        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        next = function(err) {
          self.callback(err, null, null);
        }

        controller._init(req, res, next);
        controller._invoke('renderXMLWithDotExtension');
      },

      'should not error': function(err, req, res) {
        assert.isNull(err);
      },
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/render_xml_with_dot_extension.dxtxb');
      },
      'should set content-type': function(err, req, res) {
        assert.equal(res._headers['Content-Type'], 'application/xml');
      },
    },
    
    'rendering foo using application engine': {
      topic: function(controller) {
        var self = this;
        var req, res, next;

        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(null, req, res);
        });
        next = function(err) {
          self.callback(err, null, null);
        }

        controller._init(req, res, next);
        controller._invoke('renderFoo');
      },

      'should not error': function(err, req, res) {
        assert.isNull(err);
      },
      'should render view': function(err, req, res) {
        assert.equal(res._view, 'test/render_foo.bar');
      },
      'should not set content-type': function(err, req, res) {
        assert.equal(res._headers['Content-Type'], 'application/octet-stream');
      },
    },
  },
  
  'controller instance with before filters': {
    topic: function() {
      var TestController = new Controller();
      TestController._load(new MockLocomotive(), 'TestController');
      
      TestController.foo = function() {
        this.song = 'mr-jones';
        this.render();
      }
      TestController.before('foo', function(next) {
        this.band = 'counting-crows';
        next();
      });
      TestController.before('foo', function(next) {
        this.album = 'august-and-everything-after';
        next();
      });
      
      var instance = Object.create(TestController);
      return instance;
    },
    
    'invoking an action with before filters': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(null, controller, req, res);
        });
        controller._init(req, res);
        controller._invoke('foo');
      },
      
      'should assign controller properties as response locals': function(err, c, req, res) {
        assert.lengthOf(Object.keys(res.locals), 3);
        assert.equal(res.locals.band, 'counting-crows');
        assert.equal(res.locals.album, 'august-and-everything-after');
        assert.equal(res.locals.song, 'mr-jones');
      },
      'should render view': function(err, c, req, res) {
        assert.equal(res._view, 'test/foo.html.ejs');
      },
    },
  },
  
  'controller instance with before filter on multiple actions': {
    topic: function() {
      var TestController = new Controller();
      TestController._load(new MockLocomotive(), 'TestController');
      
      TestController.foo = function() {
        this.song = 'the-end';
        this.render();
      }
      TestController.bar = function() {
        this.song = 'break-on-through';
        this.render();
      }
      TestController.before(['foo', 'bar'], function(next) {
        this.band = 'the-doors';
        next();
      });
      
      return TestController;
    },
    
    'invoking first action with before filter': {
      topic: function(TestController) {
        var controller = Object.create(TestController);
        var self = this;
        var req, res;
        
        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(null, controller, req, res);
        });
        controller._init(req, res);
        controller._invoke('foo');
      },
      
      'should assign controller properties as response locals': function(err, c, req, res) {
        assert.lengthOf(Object.keys(res.locals), 2);
        assert.equal(res.locals.band, 'the-doors');
        assert.equal(res.locals.song, 'the-end');
      },
      'should render view': function(err, c, req, res) {
        assert.equal(res._view, 'test/foo.html.ejs');
      },
    },
    
    'invoking second action with before filter': {
      topic: function(TestController) {
        var controller = Object.create(TestController);
        var self = this;
        var req, res;
        
        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(null, controller, req, res);
        });
        controller._init(req, res);
        controller._invoke('bar');
      },
      
      'should assign controller properties as response locals': function(err, c, req, res) {
        assert.lengthOf(Object.keys(res.locals), 2);
        assert.equal(res.locals.band, 'the-doors');
        assert.equal(res.locals.song, 'break-on-through');
      },
      'should render view': function(err, c, req, res) {
        assert.equal(res._view, 'test/bar.html.ejs');
      },
    },
  },
  
  'controller instance with before filter on all actions': {
    topic: function() {
      var TestController = new Controller();
      TestController._load(new MockLocomotive(), 'TestController');
      
      TestController.foo = function() {
        this.song = 'the-end';
        this.render();
      }
      TestController.bar = function() {
        this.song = 'break-on-through';
        this.render();
      }
      TestController.before('*', function(next) {
        this.band = 'the-doors';
        next();
      });
      
      return TestController;
    },
    
    'invoking first action with before filter': {
      topic: function(TestController) {
        var controller = Object.create(TestController);
        var self = this;
        var req, res;
        
        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(null, controller, req, res);
        });
        controller._init(req, res);
        controller._invoke('foo');
      },
      
      'should assign controller properties as response locals': function(err, c, req, res) {
        assert.lengthOf(Object.keys(res.locals), 2);
        assert.equal(res.locals.band, 'the-doors');
        assert.equal(res.locals.song, 'the-end');
      },
      'should render view': function(err, c, req, res) {
        assert.equal(res._view, 'test/foo.html.ejs');
      },
    },
    
    'invoking second action with before filter': {
      topic: function(TestController) {
        var controller = Object.create(TestController);
        var self = this;
        var req, res;
        
        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(null, controller, req, res);
        });
        controller._init(req, res);
        controller._invoke('bar');
      },
      
      'should assign controller properties as response locals': function(err, c, req, res) {
        assert.lengthOf(Object.keys(res.locals), 2);
        assert.equal(res.locals.band, 'the-doors');
        assert.equal(res.locals.song, 'break-on-through');
      },
      'should render view': function(err, c, req, res) {
        assert.equal(res._view, 'test/bar.html.ejs');
      },
    },
  },
  
  'controller instance with middleware as before filter': {
    topic: function() {
      var TestController = new Controller();
      TestController._load(new MockLocomotive(), 'TestController');
      
      TestController.foo = function() {
        this.song = 'mr-jones';
        this.render();
      }
      TestController.before('foo', function(req, res, next) {
        req.middleware = 'called';
        next();
      });
      
      var instance = Object.create(TestController);
      return instance;
    },
    
    'invoking an action with before filters': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(null, controller, req, res);
        });
        controller._init(req, res);
        controller._invoke('foo');
      },
      
      'should assign controller properties as response locals': function(err, c, req, res) {
        assert.lengthOf(Object.keys(res.locals), 1);
        assert.equal(res.locals.song, 'mr-jones');
      },
      'should assign request properties in before filters': function(err, c, req, res) {
        assert.equal(req.middleware, 'called');
      },
      'should render view': function(err, c, req, res) {
        assert.equal(res._view, 'test/foo.html.ejs');
      },
    },
  },
  
  'controller instance with before filters that error': {
    topic: function() {
      var TestController = new Controller();
      TestController._load(new MockLocomotive(), 'TestController');
      
      TestController.foo = function() {
        this.song = 'mr-jones';
        this.render();
      }
      TestController.before('foo', function(next) {
        this.band = 'counting-crows';
        next(new Error('something went wrong'));
      });
      TestController.before('foo', function(next) {
        this.album = 'august-and-everything-after';
        next();
      });
      
      var instance = Object.create(TestController);
      return instance;
    },
    
    'invoking an action with before filters': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        res = new MockResponse(function() {
          self.callback(new Error('should not be called'));
        });
        
        controller._init(req, res, function() {
          self.callback(null, controller, req, res);
        });
        controller._invoke('foo');
      },
      
      'should not end request': function(err, c, req, res) {
        assert.isNull(err);
      },
      'should not assign controller properties as response locals': function(err, c, req, res) {
        assert.lengthOf(Object.keys(res.locals), 0);
      },
      'should not render view': function(err, c, req, res) {
        assert.isUndefined(res._view);
      },
    },
  },
  
  'controller instance with after filters': {
    topic: function() {
      var TestController = new Controller();
      TestController._load(new MockLocomotive(), 'TestController');
      
      TestController.foo = function() {
        this.song = 'mr-jones';
        this.render();
      }
      TestController.after('foo', function(next) {
        this.band = 'counting-crows';
        next();
      });
      TestController.after('foo', function(next) {
        this.album = 'august-and-everything-after';
        this.finished();
        next();
      });
      
      var instance = Object.create(TestController);
      return instance;
    },
    
    'invoking an action with after filters': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        res = new MockResponse();
        controller.finished = function() {
          self.callback(null, controller, req, res);
        }
        
        controller._init(req, res);
        controller._invoke('foo');
      },
      
      'should assign controller properties as response locals': function(err, c, req, res) {
        assert.lengthOf(Object.keys(res.locals), 1);
        assert.equal(res.locals.song, 'mr-jones');
      },
      'should assign controller properties in after filters': function(err, c, req, res) {
        assert.equal(c.band, 'counting-crows');
        assert.equal(c.album, 'august-and-everything-after');
      },
      'should render view': function(err, c, req, res) {
        assert.equal(res._view, 'test/foo.html.ejs');
      },
    },
  },
  
  'controller instance with after filter on multiple actions': {
    topic: function() {
      var TestController = new Controller();
      TestController._load(new MockLocomotive(), 'TestController');
      
      TestController.foo = function() {
        this.song = 'the-end';
        this.render();
      }
      TestController.bar = function() {
        this.song = 'break-on-through';
        this.render();
      }
      TestController.after(['foo', 'bar'], function(next) {
        this.band = 'the-doors';
        this.finished();
        next();
      });
      
      return TestController;
    },
    
    'invoking first action with after filter': {
      topic: function(TestController) {
        var controller = Object.create(TestController);
        var self = this;
        var req, res;
        
        req = new MockRequest();
        res = new MockResponse();
        controller.finished = function() {
          self.callback(null, controller, req, res);
        }
        
        controller._init(req, res);
        controller._invoke('foo');
      },
      
      'should assign controller properties as response locals': function(err, c, req, res) {
        assert.lengthOf(Object.keys(res.locals), 1);
        assert.equal(res.locals.song, 'the-end');
      },
      'should assign controller properties in after filters': function(err, c, req, res) {
        assert.equal(c.band, 'the-doors');
      },
      'should render view': function(err, c, req, res) {
        assert.equal(res._view, 'test/foo.html.ejs');
      },
    },
    
    'invoking second action with after filter': {
      topic: function(TestController) {
        var controller = Object.create(TestController);
        var self = this;
        var req, res;
        
        req = new MockRequest();
        res = new MockResponse();
        controller.finished = function() {
          self.callback(null, controller, req, res);
        }
        
        controller._init(req, res);
        controller._invoke('bar');
      },
      
      'should assign controller properties as response locals': function(err, c, req, res) {
        assert.lengthOf(Object.keys(res.locals), 1);
        assert.equal(res.locals.song, 'break-on-through');
      },
      'should assign controller properties in after filters': function(err, c, req, res) {
        assert.equal(c.band, 'the-doors');
      },
      'should render view': function(err, c, req, res) {
        assert.equal(res._view, 'test/bar.html.ejs');
      },
    },
  },
  
  'controller instance with after filter on all actions': {
    topic: function() {
      var TestController = new Controller();
      TestController._load(new MockLocomotive(), 'TestController');
      
      TestController.foo = function() {
        this.song = 'the-end';
        this.render();
      }
      TestController.bar = function() {
        this.song = 'break-on-through';
        this.render();
      }
      TestController.after('*', function(next) {
        this.band = 'the-doors';
        this.finished();
        next();
      });
      
      return TestController;
    },
    
    'invoking first action with after filter': {
      topic: function(TestController) {
        var controller = Object.create(TestController);
        var self = this;
        var req, res;
        
        req = new MockRequest();
        res = new MockResponse();
        controller.finished = function() {
          self.callback(null, controller, req, res);
        }
        
        controller._init(req, res);
        controller._invoke('foo');
      },
      
      'should assign controller properties as response locals': function(err, c, req, res) {
        assert.lengthOf(Object.keys(res.locals), 1);
        assert.equal(res.locals.song, 'the-end');
      },
      'should assign controller properties in after filters': function(err, c, req, res) {
        assert.equal(c.band, 'the-doors');
      },
      'should render view': function(err, c, req, res) {
        assert.equal(res._view, 'test/foo.html.ejs');
      },
    },
    
    'invoking second action with after filter': {
      topic: function(TestController) {
        var controller = Object.create(TestController);
        var self = this;
        var req, res;
        
        req = new MockRequest();
        res = new MockResponse();
        controller.finished = function() {
          self.callback(null, controller, req, res);
        }
        
        controller._init(req, res);
        controller._invoke('bar');
      },
      
      'should assign controller properties as response locals': function(err, c, req, res) {
        assert.lengthOf(Object.keys(res.locals), 1);
        assert.equal(res.locals.song, 'break-on-through');
      },
      'should assign controller properties in after filters': function(err, c, req, res) {
        assert.equal(c.band, 'the-doors');
      },
      'should render view': function(err, c, req, res) {
        assert.equal(res._view, 'test/bar.html.ejs');
      },
    },
  },
  
  'controller instance with middleware as after filter': {
    topic: function() {
      var TestController = new Controller();
      TestController._load(new MockLocomotive(), 'TestController');
      
      TestController.foo = function() {
        this.song = 'mr-jones';
        this.render();
      }
      TestController.after('foo', function(req, res, next) {
        req.middleware = 'called';
        this.finished();
        next();
      });
      
      var instance = Object.create(TestController);
      return instance;
    },
    
    'invoking an action with after filters': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        res = new MockResponse();
        controller.finished = function() {
          self.callback(null, controller, req, res);
        }
        
        controller._init(req, res);
        controller._invoke('foo');
      },
      
      'should assign controller properties as response locals': function(err, c, req, res) {
        assert.lengthOf(Object.keys(res.locals), 1);
        assert.equal(res.locals.song, 'mr-jones');
      },
      'should assign request properties in after filters': function(err, c, req, res) {
        assert.equal(req.middleware, 'called');
      },
      'should render view': function(err, c, req, res) {
        assert.equal(res._view, 'test/foo.html.ejs');
      },
    },
  },
  
  'controller instance with after filters that error': {
    topic: function() {
      var TestController = new Controller();
      TestController._load(new MockLocomotive(), 'TestController');
      
      TestController.foo = function() {
        this.song = 'mr-jones';
        this.render();
      }
      TestController.after('foo', function(next) {
        this.band = 'counting-crows';
        next(new Error('something went wrong'));
      });
      TestController.after('foo', function(next) {
        this.album = 'august-and-everything-after';
        next();
      });
      
      var instance = Object.create(TestController);
      return instance;
    },
    
    'invoking an action with after filters': {
      topic: function(controller) {
        var self = this;
        var req, res;
        
        req = new MockRequest();
        res = new MockResponse();
        
        controller._init(req, res, function() {
          self.callback(null, controller, req, res);
        });
        controller._invoke('foo');
      },
      
      'should assign controller properties as response locals': function(err, c, req, res) {
        assert.lengthOf(Object.keys(res.locals), 1);
        assert.equal(res.locals.song, 'mr-jones');
      },
      'should assign controller properties in after filters': function(err, c, req, res) {
        assert.equal(c.band, 'counting-crows');
        assert.isUndefined(c.album);
      },
      'should render view': function(err, c, req, res) {
        assert.equal(res._view, 'test/foo.html.ejs');
      },
    },
  },
  
  'controller instance with "private" functions': {
    topic: function() {
      var TestController = new Controller();
      TestController._load(new MockLocomotive(), 'TestController');
      
      TestController.foo = function() {
        this.render();
      }
      TestController.bar = function() {
        this.render();
      }
      TestController._private = function() {
        var i = 1 + 1;
      }
      
      return TestController;
    },
    
    'should assign controller properties as response locals': function(TestController) {
      assert.lengthOf(TestController._actions(), 2);
      assert.equal(TestController._actions()[0], 'foo');
      assert.equal(TestController._actions()[1], 'bar');
    },
  },
  
  'controller hooks': {
    topic: function() {
      return new Controller();
    },
    
    'should have pre and post hooks': function (controller) {
      assert.isFunction(controller.pre);
      assert.isFunction(controller.post);
    },
  },
  
}).export(module);
