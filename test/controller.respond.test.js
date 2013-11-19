var Controller = require('../lib/locomotive/controller')
  , MockApplication = require('./mocks/application')
  , MockRequest = require('./mocks/request')
  , MockResponse = require('./mocks/response');



describe('Controller#respond', function() {
  
  it('should be aliased to respondWith', function() {
    expect(Controller.prototype.respond).to.equal(Controller.prototype.respondWith);
  });
  
  describe('to request that accepts JSON based on MIME type using function', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingFunctionKeyedByMimeType = function() {
      var self = this;
      this.respond({
        'application/json': function() { self.render({ format: 'json', engine: 'jsonb' }); },
        'application/xml': function() { self.render({ format: 'xml', engine: 'xmlb' }); }
      });
    }
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return 'application/json';
      }
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
    }
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return 'application/xml';
      }
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
    }
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return 'application/json';
      }
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
    }
    
    var req, res, error, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return undefined;
      }
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
    }
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return undefined;
      }
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
  
  
  describe('to request that accepts JSON based on extension using function', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingFunctionKeyedByExtension = function() {
      var self = this;
      this.respond({
        'json': function() { self.render({ format: 'json', engine: 'jsonb' }); },
        'xml': function() { self.render({ format: 'xml', engine: 'xmlb' }); }
      });
    }
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return 'json';
      }
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
    }
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return 'xml';
      }
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
    }
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return 'json';
      }
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
    }
    
    var req, res, error, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return undefined;
      }
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
    }
    
    var req, res, types;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(type) {
        types = type;
        return undefined;
      }
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
  
});
