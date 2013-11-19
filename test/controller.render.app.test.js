var Controller = require('../lib/locomotive/controller')
  , MockApplication = require('./mocks/application')
  , MockRequest = require('./mocks/request')
  , MockResponse = require('./mocks/response');



describe('Controller#render', function() {
  
  describe('using application mapping of HTML format to extension', function() {
    
    var app = new MockApplication();
    app.format('html', { extension: 'jade' });
    
    describe('with defaults', function() {
      var controller = new Controller();
      controller.renderDefaults = function() {
        this.render();
      }
    
      var req, res;
    
      before(function(done) {
        req = new MockRequest();
        res = new MockResponse(done);
      
        controller._init(app, 'test');
        controller._prepare(req, res, function(err) {
          if (err) { return done(err); }
          return done(new Error('should not call next'));
        });
        controller._invoke('renderDefaults');
      });
    
      // TODO: Figure out strategy for setting content-type, and apply it to all test cases
      it.skip('should set content-type header', function() {
        expect(res.getHeader('Content-Type')).to.equal('text/html');
      });
    
      it('should render view without options', function() {
        expect(res._view).to.equal('test/render_defaults.jade');
        expect(res._options).to.be.an('object');
        expect(Object.keys(res._options)).to.have.length(0);
      });
    
      it('should not assign locals', function() {
        expect(res.locals).to.be.an('object');
        expect(Object.keys(res.locals)).to.have.length(0);
      });
    });
    
    describe('with engine override', function() {
      var controller = new Controller();
      controller.renderWithEngineOverride = function() {
        this.render({ engine: 'dust' });
      }
    
      var req, res;
    
      before(function(done) {
        req = new MockRequest();
        res = new MockResponse(done);
      
        controller._init(app, 'test');
        controller._prepare(req, res, function(err) {
          if (err) { return done(err); }
          return done(new Error('should not call next'));
        });
        controller._invoke('renderWithEngineOverride');
      });
    
      // TODO: Figure out strategy for setting content-type, and apply it to all test cases
      it.skip('should set content-type header', function() {
        expect(res.getHeader('Content-Type')).to.equal('text/html');
      });
    
      it('should render view without options', function() {
        expect(res._view).to.equal('test/render_with_engine_override.html.dust');
        expect(res._options).to.be.an('object');
        expect(Object.keys(res._options)).to.have.length(0);
      });
    
      it('should not assign locals', function() {
        expect(res.locals).to.be.an('object');
        expect(Object.keys(res.locals)).to.have.length(0);
      });
    });
    
    describe('with extension override', function() {
      var controller = new Controller();
      controller.renderWithExtensionOverride = function() {
        this.render({ extension: 'stache' });
      }
    
      var req, res;
    
      before(function(done) {
        req = new MockRequest();
        res = new MockResponse(done);
      
        controller._init(app, 'test');
        controller._prepare(req, res, function(err) {
          if (err) { return done(err); }
          return done(new Error('should not call next'));
        });
        controller._invoke('renderWithExtensionOverride');
      });
    
      // TODO: Figure out strategy for setting content-type, and apply it to all test cases
      it.skip('should set content-type header', function() {
        expect(res.getHeader('Content-Type')).to.equal('text/html');
      });
    
      it('should render view without options', function() {
        expect(res._view).to.equal('test/render_with_extension_override.stache');
        expect(res._options).to.be.an('object');
        expect(Object.keys(res._options)).to.have.length(0);
      });
    
      it('should not assign locals', function() {
        expect(res.locals).to.be.an('object');
        expect(Object.keys(res.locals)).to.have.length(0);
      });
    });
    
    describe('unconfigured format', function() {
      var controller = new Controller();
      controller.renderUnconfiguredFormat = function() {
        this.render({ format: 'xml' });
      }
    
      var req, res;
    
      before(function(done) {
        req = new MockRequest();
        res = new MockResponse(done);
      
        controller._init(app, 'test');
        controller._prepare(req, res, function(err) {
          if (err) { return done(err); }
          return done(new Error('should not call next'));
        });
        controller._invoke('renderUnconfiguredFormat');
      });
    
      // TODO: Figure out strategy for setting content-type, and apply it to all test cases
      it.skip('should set content-type header', function() {
        expect(res.getHeader('Content-Type')).to.equal('text/html');
      });
    
      it('should render view without options', function() {
        expect(res._view).to.equal('test/render_unconfigured_format.xml.ejs');
        expect(res._options).to.be.an('object');
        expect(Object.keys(res._options)).to.have.length(0);
      });
    
      it('should not assign locals', function() {
        expect(res.locals).to.be.an('object');
        expect(Object.keys(res.locals)).to.have.length(0);
      });
    });
  });
  
});
