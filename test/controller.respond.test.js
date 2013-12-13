/* global describe, it, before, expect */

var Controller = require('../lib/controller')
  , MockApplication = require('./mocks/application')
  , MockRequest = require('./mocks/request')
  , MockResponse = require('./mocks/response');



describe('Controller#respond', function() {
  
  it('should be aliased to respondWith', function() {
    expect(Controller.prototype.respond).to.equal(Controller.prototype.respondWith);
  });
  
  
  /* function keyed by MIME type */
  
  describe('to request that accepts JSON based on MIME type using function', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingFunctionKeyedByMimeType = function() {
      var self = this;
      this.respond({
        'application/json': function() { self.render({ format: 'json', engine: 'jsonb' }); },
        'application/xml': function() { self.render({ format: 'xml', engine: 'xmlb' }); }
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return 'application/json';
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondUsingFunctionKeyedByMimeType');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(2);
      expect(types[0]).to.equal('application/json');
      expect(types[1]).to.equal('application/xml');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/json');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_using_function_keyed_by_mime_type.json.jsonb');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that accepts XML based on MIME type using function', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingFunctionKeyedByMimeType = function() {
      var self = this;
      this.respond({
        'application/json': function() { self.render({ format: 'json', engine: 'jsonb' }); },
        'application/xml': function() { self.render({ format: 'xml', engine: 'xmlb' }); }
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return 'application/xml';
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondUsingFunctionKeyedByMimeType');
    });
    
    it('should negotiate content types', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(2);
      expect(types[0]).to.equal('application/json');
      expect(types[1]).to.equal('application/xml');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/xml');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_using_function_keyed_by_mime_type.xml.xmlb');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that specifies XML parameter based on MIME type using function', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingFunctionKeyedByMimeType = function() {
      var self = this;
      this.respond({
        'application/json': function() { self.render({ format: 'json', engine: 'jsonb' }); },
        'application/xml': function() { self.render({ format: 'xml', engine: 'xmlb' }); }
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return 'application/json';
      };
      // format extension overrides accept header
      req.params = { format: 'xml' };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondUsingFunctionKeyedByMimeType');
    });
    
    it('should not negotiate content type', function() {
      expect(types).to.be.undefined;
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/xml');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_using_function_keyed_by_mime_type.xml.xmlb');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that accepts an unsupported format based on MIME type using function', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingFunctionKeyedByMimeType = function() {
      var self = this;
      this.respond({
        'application/json': function() { self.render({ format: 'json', engine: 'jsonb' }); },
        'application/xml': function() { self.render({ format: 'xml', engine: 'xmlb' }); }
      });
    };
    
    var req, res, error, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return undefined;
      };
      res = new MockResponse(function() {
        return done(new Error('should not call res#end'));
      });
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        error = err;
        return done();
      });
      controller._invoke('respondUsingFunctionKeyedByMimeType');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(2);
      expect(types[0]).to.equal('application/json');
      expect(types[1]).to.equal('application/xml');
    });
    
    it('should not set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.be.undefined;
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should next with error', function() {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.be.equal('Not Acceptable');
      expect(error.status).to.be.equal(406);
      expect(error.types).to.be.an('array');
      expect(error.types).to.have.lengthOf(2);
      expect(error.types[0]).to.equal('application/json');
      expect(error.types[1]).to.equal('application/xml');
    });
  });
  
  describe('to request that accepts an unsupported format based on default MIME type using function', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingFunctionKeyedByMimeTypeWithDefault = function() {
      var self = this;
      this.respond({
        'application/json': function() { self.render({ format: 'json', engine: 'jsonb' }); },
        'application/xml': function() { self.render({ format: 'xml', engine: 'xmlb' }); },
        default: function() { self.render({ format: 'foo', engine: 'foob' }); }
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return undefined;
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondUsingFunctionKeyedByMimeTypeWithDefault');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(2);
      expect(types[0]).to.equal('application/json');
      expect(types[1]).to.equal('application/xml');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/octet-stream');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_using_function_keyed_by_mime_type_with_default.foo.foob');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that accepts any format based on default MIME type using function', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondToAnyFormatWithDefault = function() {
      var self = this;
      this.respond({
        'application/json': function() { self.render({ format: 'json', engine: 'jsonb' }); },
        'application/xml': function() { self.render({ format: 'xml', engine: 'xmlb' }); },
        default: function() { self.render({ format: 'html', engine: 'dust' }); }
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.headers.accept = '*/*';
      req.accepts = function(type) {
        types = type;
        return 'application/json';
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondToAnyFormatWithDefault');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(2);
      expect(types[0]).to.equal('application/json');
      expect(types[1]).to.equal('application/xml');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('text/html; charset=UTF-8');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_to_any_format_with_default.html.dust');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that accepts any format with extension override based on selected MIME type using function', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondToAnyFormatWithDefault = function() {
      var self = this;
      this.respond({
        'application/json': function() { self.render({ format: 'json', engine: 'jsonb' }); },
        'application/xml': function() { self.render({ format: 'xml', engine: 'xmlb' }); },
        default: function() { self.render({ format: 'html', engine: 'dust' }); }
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.headers.accept = '*/*';
      req.accepts = function(type) {
        types = type;
        return 'application/json';
      };
      // format extension overrides accept header
      req.params = { format: 'xml' };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondToAnyFormatWithDefault');
    });
    
    it('should not negotiate content type', function() {
      expect(types).to.be.undefined;
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/xml');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_to_any_format_with_default.xml.xmlb');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that accepts any format based on priority MIME type using function', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondToAnyFormatWithFirst = function() {
      var self = this;
      this.respond({
        'application/json': function() { self.render({ format: 'json', engine: 'jsonb' }); },
        'application/xml': function() { self.render({ format: 'xml', engine: 'xmlb' }); }
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.headers.accept = '*/*';
      req.accepts = function(type) {
        types = type;
        return 'application/json';
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondToAnyFormatWithFirst');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(2);
      expect(types[0]).to.equal('application/json');
      expect(types[1]).to.equal('application/xml');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/json');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_to_any_format_with_first.json.jsonb');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that accepts any format with extension override based on selected MIME type using function', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondToAnyFormatWithFirst = function() {
      var self = this;
      this.respond({
        'application/json': function() { self.render({ format: 'json', engine: 'jsonb' }); },
        'application/xml': function() { self.render({ format: 'xml', engine: 'xmlb' }); }
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.headers.accept = '*/*';
      req.accepts = function(type) {
        types = type;
        return 'application/json';
      };
      // format extension overrides accept header
      req.params = { format: 'xml' };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondToAnyFormatWithFirst');
    });
    
    it('should not negotiate content type', function() {
      expect(types).to.be.undefined;
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/xml');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_to_any_format_with_first.xml.xmlb');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  
  /* function keyed by extension */
  
  describe('to request that accepts JSON based on extension using function', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingFunctionKeyedByExtension = function() {
      var self = this;
      this.respond({
        'json': function() { self.render({ format: 'json', engine: 'jsonb' }); },
        'xml': function() { self.render({ format: 'xml', engine: 'xmlb' }); }
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return 'json';
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondUsingFunctionKeyedByExtension');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(2);
      expect(types[0]).to.equal('json');
      expect(types[1]).to.equal('xml');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/json');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_using_function_keyed_by_extension.json.jsonb');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that accepts XML based on extension using function', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingFunctionKeyedByExtension = function() {
      var self = this;
      this.respond({
        'json': function() { self.render({ format: 'json', engine: 'jsonb' }); },
        'xml': function() { self.render({ format: 'xml', engine: 'xmlb' }); }
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return 'xml';
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondUsingFunctionKeyedByExtension');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(2);
      expect(types[0]).to.equal('json');
      expect(types[1]).to.equal('xml');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/xml');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_using_function_keyed_by_extension.xml.xmlb');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that specifies XML parameter based on extension using function', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingFunctionKeyedByExtension = function() {
      var self = this;
      this.respond({
        'json': function() { self.render({ format: 'json', engine: 'jsonb' }); },
        'xml': function() { self.render({ format: 'xml', engine: 'xmlb' }); }
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return 'json';
      };
      // format extension overrides accept header
      req.params = { format: 'xml' };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondUsingFunctionKeyedByExtension');
    });
    
    it('should not negotiate content type', function() {
      expect(types).to.be.undefined;
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/xml');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_using_function_keyed_by_extension.xml.xmlb');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that accepts an unsupported format based on extension using function', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingFunctionKeyedByExtension = function() {
      var self = this;
      this.respond({
        'json': function() { self.render({ format: 'json', engine: 'jsonb' }); },
        'xml': function() { self.render({ format: 'xml', engine: 'xmlb' }); }
      });
    };
    
    var req, res, error, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return undefined;
      };
      res = new MockResponse(function() {
        return done(new Error('should not call res#end'));
      });
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        error = err;
        return done();
      });
      controller._invoke('respondUsingFunctionKeyedByExtension');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(2);
      expect(types[0]).to.equal('json');
      expect(types[1]).to.equal('xml');
    });
    
    it('should not set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.be.undefined;
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should next with error', function() {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.be.equal('Not Acceptable');
      expect(error.status).to.be.equal(406);
      expect(error.types).to.be.an('array');
      expect(error.types).to.have.lengthOf(2);
      expect(error.types[0]).to.equal('application/json');
      expect(error.types[1]).to.equal('application/xml');
    });
  });
  
  describe('to request that accepts an unsupported format based on default extension using function', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingFunctionKeyedByExtensionWithDefault = function() {
      var self = this;
      this.respond({
        'json': function() { self.render({ format: 'json', engine: 'jsonb' }); },
        'xml': function() { self.render({ format: 'xml', engine: 'xmlb' }); },
        default: function() { self.render({ format: 'foo', engine: 'foob' }); }
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return undefined;
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondUsingFunctionKeyedByExtensionWithDefault');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(2);
      expect(types[0]).to.equal('json');
      expect(types[1]).to.equal('xml');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/octet-stream');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_using_function_keyed_by_extension_with_default.foo.foob');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that accepts any format based on default extension using function', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondToAnyFormatWithDefault = function() {
      var self = this;
      this.respond({
        'json': function() { self.render({ format: 'json', engine: 'jsonb' }); },
        'xml': function() { self.render({ format: 'xml', engine: 'xmlb' }); },
        default: function() { self.render({ format: 'html', engine: 'dust' }); }
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.headers.accept = '*/*';
      req.accepts = function(type) {
        types = type;
        return undefined;
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondToAnyFormatWithDefault');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(2);
      expect(types[0]).to.equal('json');
      expect(types[1]).to.equal('xml');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('text/html; charset=UTF-8');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_to_any_format_with_default.html.dust');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that accepts any format with extension override based on selected extension using function', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondToAnyFormatWithDefault = function() {
      var self = this;
      this.respond({
        'json': function() { self.render({ format: 'json', engine: 'jsonb' }); },
        'xml': function() { self.render({ format: 'xml', engine: 'xmlb' }); },
        default: function() { self.render({ format: 'html', engine: 'dust' }); }
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.headers.accept = '*/*';
      req.accepts = function(type) {
        types = type;
        return undefined;
      };
      // format extension overrides accept header
      req.params = { format: 'xml' };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondToAnyFormatWithDefault');
    });
    
    it('should not negotiate content type', function() {
      expect(types).to.be.undefined;
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/xml');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_to_any_format_with_default.xml.xmlb');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that accepts any format based on priority extension using function', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondToAnyFormatWithFirst = function() {
      var self = this;
      this.respond({
        'json': function() { self.render({ format: 'json', engine: 'jsonb' }); },
        'xml': function() { self.render({ format: 'xml', engine: 'xmlb' }); }
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.headers.accept = '*/*';
      req.accepts = function(type) {
        types = type;
        return undefined;
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondToAnyFormatWithFirst');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(2);
      expect(types[0]).to.equal('json');
      expect(types[1]).to.equal('xml');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/json');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_to_any_format_with_first.json.jsonb');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that accepts any format with extension override based on selected extension using function', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondToAnyFormatWithFirst = function() {
      var self = this;
      this.respond({
        'json': function() { self.render({ format: 'json', engine: 'jsonb' }); },
        'xml': function() { self.render({ format: 'xml', engine: 'xmlb' }); }
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.headers.accept = '*/*';
      req.accepts = function(type) {
        types = type;
        return undefined;
      };
      // format extension overrides accept header
      req.params = { format: 'xml' };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondToAnyFormatWithFirst');
    });
    
    it('should not negotiate content type', function() {
      expect(types).to.be.undefined;
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/xml');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_to_any_format_with_first.xml.xmlb');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  
  /* options keyed by MIME type */
  
  describe('to request that accepts JSON based on MIME type using options', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingOptionsKeyedByMimeType = function() {
      this.respond({
        'application/json': { engine: 'jsonb' },
        'application/xml': { template: 'feed', engine: 'xmlb' },
        'application/vnd.acme.foo': { format: 'foo', engine: 'foob' }
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return 'application/json';
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondUsingOptionsKeyedByMimeType');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(3);
      expect(types[0]).to.equal('application/json');
      expect(types[1]).to.equal('application/xml');
      expect(types[2]).to.equal('application/vnd.acme.foo');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/json');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_using_options_keyed_by_mime_type.json.jsonb');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that accepts XML based on MIME type using options', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingOptionsKeyedByMimeType = function() {
      this.respond({
        'application/json': { engine: 'jsonb' },
        'application/xml': { template: 'feed', engine: 'xmlb' },
        'application/vnd.acme.foo': { format: 'foo', engine: 'foob' }
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return 'application/xml';
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondUsingOptionsKeyedByMimeType');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(3);
      expect(types[0]).to.equal('application/json');
      expect(types[1]).to.equal('application/xml');
      expect(types[2]).to.equal('application/vnd.acme.foo');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/xml');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/feed.xml.xmlb');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that accepts proprietary format based on MIME type using options', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingOptionsKeyedByMimeType = function() {
      this.respond({
        'application/json': { engine: 'jsonb' },
        'application/xml': { template: 'feed', engine: 'xmlb' },
        'application/vnd.acme.foo': { format: 'foo', engine: 'foob' }
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return 'application/vnd.acme.foo';
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondUsingOptionsKeyedByMimeType');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(3);
      expect(types[0]).to.equal('application/json');
      expect(types[1]).to.equal('application/xml');
      expect(types[2]).to.equal('application/vnd.acme.foo');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/vnd.acme.foo');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_using_options_keyed_by_mime_type.foo.foob');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that accepts an unsupported format based on MIME type using options', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingOptionsKeyedByMimeType = function() {
      this.respond({
        'application/json': { engine: 'jsonb' },
        'application/xml': { template: 'feed', engine: 'xmlb' },
        'application/vnd.acme.foo': { format: 'foo', engine: 'foob' }
      });
    };
    
    var req, res, error, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return undefined;
      };
      res = new MockResponse(function() {
        return done(new Error('should not call res#end'));
      });
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        error = err;
        return done();
      });
      controller._invoke('respondUsingOptionsKeyedByMimeType');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(3);
      expect(types[0]).to.equal('application/json');
      expect(types[1]).to.equal('application/xml');
      expect(types[2]).to.equal('application/vnd.acme.foo');
    });
    
    it('should not set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.be.undefined;
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should next with error', function() {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.be.equal('Not Acceptable');
      expect(error.status).to.be.equal(406);
      expect(error.types).to.be.an('array');
      expect(error.types).to.have.lengthOf(3);
      expect(error.types[0]).to.equal('application/json');
      expect(error.types[1]).to.equal('application/xml');
      expect(error.types[2]).to.equal('application/vnd.acme.foo');
    });
  });
  
  describe('to request that accepts an unsupported format based on default MIME type using true', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingOptionsKeyedByMimeTypeWithDefault = function() {
      this.respond({
        'application/json': { engine: 'jsonb' },
        'application/xml': { template: 'feed', engine: 'xmlb' },
        'application/vnd.acme.foo': { format: 'foo', engine: 'foob' },
        default: true
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return undefined;
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondUsingOptionsKeyedByMimeTypeWithDefault');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(3);
      expect(types[0]).to.equal('application/json');
      expect(types[1]).to.equal('application/xml');
      expect(types[2]).to.equal('application/vnd.acme.foo');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('text/html; charset=UTF-8');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_using_options_keyed_by_mime_type_with_default.html.ejs');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that accepts an unsupported format based on default MIME type using empty options', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingOptionsKeyedByMimeTypeWithDefault = function() {
      this.respond({
        'application/json': { engine: 'jsonb' },
        'application/xml': { template: 'feed', engine: 'xmlb' },
        'application/vnd.acme.foo': { format: 'foo', engine: 'foob' },
        default: {}
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return undefined;
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondUsingOptionsKeyedByMimeTypeWithDefault');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(3);
      expect(types[0]).to.equal('application/json');
      expect(types[1]).to.equal('application/xml');
      expect(types[2]).to.equal('application/vnd.acme.foo');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('text/html; charset=UTF-8');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_using_options_keyed_by_mime_type_with_default.html.ejs');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that accepts an unsupported format based on default MIME type using options', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingOptionsKeyedByMimeTypeWithDefault = function() {
      this.respond({
        'application/json': { engine: 'jsonb' },
        'application/xml': { template: 'feed', engine: 'xmlb' },
        'application/vnd.acme.foo': { format: 'foo', engine: 'foob' },
        default: { format: 'yaml', engine: 'yamlb' }
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return undefined;
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondUsingOptionsKeyedByMimeTypeWithDefault');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(3);
      expect(types[0]).to.equal('application/json');
      expect(types[1]).to.equal('application/xml');
      expect(types[2]).to.equal('application/vnd.acme.foo');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/octet-stream');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_using_options_keyed_by_mime_type_with_default.yaml.yamlb');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that accepts any format based on default MIME type using true', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingOptionsKeyedByMimeTypeWithDefault = function() {
      this.respond({
        'application/json': { engine: 'jsonb' },
        'application/xml': { template: 'feed', engine: 'xmlb' },
        'application/vnd.acme.foo': { format: 'foo', engine: 'foob' },
        default: true
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.headers.accept = '*/*';
      req.accepts = function(type) {
        types = type;
        return 'application/json';
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondUsingOptionsKeyedByMimeTypeWithDefault');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(3);
      expect(types[0]).to.equal('application/json');
      expect(types[1]).to.equal('application/xml');
      expect(types[2]).to.equal('application/vnd.acme.foo');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('text/html; charset=UTF-8');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_using_options_keyed_by_mime_type_with_default.html.ejs');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that accepts any format with extension override based on selected MIME type using options', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingOptionsKeyedByMimeTypeWithDefault = function() {
      this.respond({
        'application/json': { engine: 'jsonb' },
        'application/xml': { template: 'feed', engine: 'xmlb' },
        'application/vnd.acme.foo': { format: 'foo', engine: 'foob' },
        default: true
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.headers.accept = '*/*';
      req.accepts = function(type) {
        types = type;
        return 'application/json';
      };
      // format extension overrides accept header
      req.params = { format: 'xml' };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondUsingOptionsKeyedByMimeTypeWithDefault');
    });
    
    it('should not negotiate content type', function() {
      expect(types).to.be.undefined;
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/xml');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/feed.xml.xmlb');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that accepts any format based on priority MIME type using options', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingOptionsKeyedByMimeTypeWithDefault = function() {
      this.respond({
        'application/json': { engine: 'jsonb' },
        'application/xml': { template: 'feed', engine: 'xmlb' },
        'application/vnd.acme.foo': { format: 'foo', engine: 'foob' }
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.headers.accept = '*/*';
      req.accepts = function(type) {
        types = type;
        return 'application/json';
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondUsingOptionsKeyedByMimeTypeWithDefault');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(3);
      expect(types[0]).to.equal('application/json');
      expect(types[1]).to.equal('application/xml');
      expect(types[2]).to.equal('application/vnd.acme.foo');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/json');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_using_options_keyed_by_mime_type_with_default.json.jsonb');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that accepts any format with extension override based on selected MIME type using options', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingOptionsKeyedByMimeTypeWithDefault = function() {
      this.respond({
        'application/json': { engine: 'jsonb' },
        'application/xml': { template: 'feed', engine: 'xmlb' },
        'application/vnd.acme.foo': { format: 'foo', engine: 'foob' }
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.headers.accept = '*/*';
      req.accepts = function(type) {
        types = type;
        return 'application/json';
      };
      // format extension overrides accept header
      req.params = { format: 'xml' };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondUsingOptionsKeyedByMimeTypeWithDefault');
    });
    
    it('should not negotiate content type', function() {
      expect(types).to.be.undefined;
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/xml');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/feed.xml.xmlb');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  
  /* options keyed by extension */
  
  describe('to request that accepts JSON based on extension using options', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingOptionsKeyedByExtension = function() {
      this.respond({
        'json': { engine: 'jsonb' },
        'xml': { template: 'feed', engine: 'xmlb' },
        'foo': { format: 'foo', engine: 'foob' }
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return 'json';
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondUsingOptionsKeyedByExtension');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(3);
      expect(types[0]).to.equal('json');
      expect(types[1]).to.equal('xml');
      expect(types[2]).to.equal('foo');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/json');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_using_options_keyed_by_extension.json.jsonb');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that accepts XML based on extension using options', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingOptionsKeyedByExtension = function() {
      this.respond({
        'json': { engine: 'jsonb' },
        'xml': { template: 'feed', engine: 'xmlb' },
        'foo': { format: 'foo', engine: 'foob' }
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return 'xml';
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondUsingOptionsKeyedByExtension');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(3);
      expect(types[0]).to.equal('json');
      expect(types[1]).to.equal('xml');
      expect(types[2]).to.equal('foo');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/xml');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/feed.xml.xmlb');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that accepts proprietary format based on extension using options', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingOptionsKeyedByExtension = function() {
      this.respond({
        'json': { engine: 'jsonb' },
        'xml': { template: 'feed', engine: 'xmlb' },
        'foo': { format: 'foo', engine: 'foob' }
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return 'foo';
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondUsingOptionsKeyedByExtension');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(3);
      expect(types[0]).to.equal('json');
      expect(types[1]).to.equal('xml');
      expect(types[2]).to.equal('foo');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/octet-stream');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_using_options_keyed_by_extension.foo.foob');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that accepts an unsupported format based on extension using options', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingOptionsKeyedByExtension = function() {
      this.respond({
        'json': { engine: 'jsonb' },
        'xml': { template: 'feed', engine: 'xmlb' },
        'foo': { format: 'foo', engine: 'foob' }
      });
    };
    
    var req, res, error, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return undefined;
      };
      res = new MockResponse(function() {
        return done(new Error('should not call res#end'));
      });
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        error = err;
        return done();
      });
      controller._invoke('respondUsingOptionsKeyedByExtension');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(3);
      expect(types[0]).to.equal('json');
      expect(types[1]).to.equal('xml');
      expect(types[2]).to.equal('foo');
    });
    
    it('should not set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.be.undefined;
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should next with error', function() {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.be.equal('Not Acceptable');
      expect(error.status).to.be.equal(406);
      expect(error.types).to.be.an('array');
      expect(error.types).to.have.lengthOf(3);
      expect(error.types[0]).to.equal('application/json');
      expect(error.types[1]).to.equal('application/xml');
      expect(error.types[2]).to.equal('application/octet-stream');
    });
  });
  
  describe('to request that accepts an unsupported format based on default extension using true', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingOptionsKeyedByExtensionWithDefault = function() {
      this.respond({
        'json': { engine: 'jsonb' },
        'xml': { template: 'feed', engine: 'xmlb' },
        'foo': { format: 'foo', engine: 'foob' },
        default: true
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return undefined;
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondUsingOptionsKeyedByExtensionWithDefault');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(3);
      expect(types[0]).to.equal('json');
      expect(types[1]).to.equal('xml');
      expect(types[2]).to.equal('foo');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('text/html; charset=UTF-8');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_using_options_keyed_by_extension_with_default.html.ejs');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that accepts an unsupported format based on default extension using empty options', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingOptionsKeyedByExtensionWithDefault = function() {
      this.respond({
        'json': { engine: 'jsonb' },
        'xml': { template: 'feed', engine: 'xmlb' },
        'foo': { format: 'foo', engine: 'foob' },
        default: {}
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return undefined;
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondUsingOptionsKeyedByExtensionWithDefault');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(3);
      expect(types[0]).to.equal('json');
      expect(types[1]).to.equal('xml');
      expect(types[2]).to.equal('foo');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('text/html; charset=UTF-8');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_using_options_keyed_by_extension_with_default.html.ejs');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that accepts an unsupported format based on default extension using options', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingOptionsKeyedByExtensionWithDefault = function() {
      this.respond({
        'json': { engine: 'jsonb' },
        'xml': { template: 'feed', engine: 'xmlb' },
        'foo': { format: 'foo', engine: 'foob' },
        default: { format: 'yaml', engine: 'yamlb' }
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return undefined;
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondUsingOptionsKeyedByExtensionWithDefault');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(3);
      expect(types[0]).to.equal('json');
      expect(types[1]).to.equal('xml');
      expect(types[2]).to.equal('foo');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/octet-stream');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_using_options_keyed_by_extension_with_default.yaml.yamlb');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  
  /* defaults keyed by MIME type */
  
  describe('to request that accepts JSON based on MIME type using defaults', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingDefaultsKeyedByMimeType = function() {
      this.respond({
        'application/json': true,
        'application/xml': true
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return 'application/json';
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondUsingDefaultsKeyedByMimeType');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(2);
      expect(types[0]).to.equal('application/json');
      expect(types[1]).to.equal('application/xml');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/json');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_using_defaults_keyed_by_mime_type.json.ejs');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that accepts XML based on MIME type using defaults', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingDefaultsKeyedByMimeType = function() {
      this.respond({
        'application/json': true,
        'application/xml': true
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return 'application/xml';
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondUsingDefaultsKeyedByMimeType');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(2);
      expect(types[0]).to.equal('application/json');
      expect(types[1]).to.equal('application/xml');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/xml');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_using_defaults_keyed_by_mime_type.xml.ejs');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  
  /* defaults keyed by extension */
  
  describe('to request that accepts JSON based on extension using defaults', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingDefaultsKeyedByExtension = function() {
      this.respond({
        'json': true,
        'xml': true
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return 'json';
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondUsingDefaultsKeyedByExtension');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(2);
      expect(types[0]).to.equal('json');
      expect(types[1]).to.equal('xml');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/json');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_using_defaults_keyed_by_extension.json.ejs');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to request that accepts XML based on extension using defaults', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingDefaultsKeyedByExtension = function() {
      this.respond({
        'json': true,
        'xml': true
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return 'xml';
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondUsingDefaultsKeyedByExtension');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(2);
      expect(types[0]).to.equal('json');
      expect(types[1]).to.equal('xml');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/xml');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/respond_using_defaults_keyed_by_extension.xml.ejs');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  
  /* Vary Header */
  
  describe('to request that accepts JSON based after setting vary field to accept', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondWithVary = function() {
      var self = this;
      this.res.setHeader('Vary', 'Accept');
      this.respond({
        'application/json': function() { self.render({ format: 'json', engine: 'jsonb' }); },
        'application/xml': function() { self.render({ format: 'xml', engine: 'xmlb' }); }
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return 'application/json';
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondWithVary');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(2);
      expect(types[0]).to.equal('application/json');
      expect(types[1]).to.equal('application/xml');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/json');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept');
    });
  });
  
  describe('to request that accepts JSON based after setting vary field to accept-encoding', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondWithVary = function() {
      var self = this;
      this.res.setHeader('Vary', 'Accept-Encoding');
      this.respond({
        'application/json': function() { self.render({ format: 'json', engine: 'jsonb' }); },
        'application/xml': function() { self.render({ format: 'xml', engine: 'xmlb' }); }
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return 'application/json';
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondWithVary');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(2);
      expect(types[0]).to.equal('application/json');
      expect(types[1]).to.equal('application/xml');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/json');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept-Encoding, Accept');
    });
  });
  
  describe('to request that accepts JSON based after setting vary field to accept and accept-encoding', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondWithVary = function() {
      var self = this;
      this.res.setHeader('Vary', 'Accept, Accept-Encoding');
      this.respond({
        'application/json': function() { self.render({ format: 'json', engine: 'jsonb' }); },
        'application/xml': function() { self.render({ format: 'xml', engine: 'xmlb' }); }
      });
    };
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return 'application/json';
      };
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('respondWithVary');
    });
    
    it('should negotiate content type', function() {
      expect(types).to.be.an('array');
      expect(types).to.have.lengthOf(2);
      expect(types[0]).to.equal('application/json');
      expect(types[1]).to.equal('application/xml');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/json');
    });
    
    it('should set vary header', function() {
      expect(res.getHeader('Vary')).to.equal('Accept, Accept-Encoding');
    });
  });
  
});
