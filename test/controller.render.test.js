var Controller = require('../lib/locomotive/controller')
  , MockApplication = require('./mocks/application')
  , MockRequest = require('./mocks/request')
  , MockResponse = require('./mocks/response');



describe('Controller#render', function() {
  
  describe('without arguments', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.renderWithoutArguments = function() {
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
      controller._invoke('renderWithoutArguments');
    });
    
    // TODO: Figure out strategy for setting content-type, and apply it to all test cases
    it.skip('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('text/html');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/render_without_arguments.html.ejs');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('without arguments after assigning locals', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.renderWithLocals = function() {
      this.title = 'On The Road';
      this.author = 'Jack Kerouac';
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
      controller._invoke('renderWithLocals');
    });
    
    it.skip('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('text/html');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/render_with_locals.html.ejs');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(2);
      expect(res.locals.title).to.equal('On The Road');
      expect(res.locals.author).to.equal('Jack Kerouac');
    });
  });
  
  describe('with format option', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.renderWithFormat = function() {
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
      controller._invoke('renderWithFormat');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/xml');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/render_with_format.xml.ejs');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('with engine option', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.renderWithEngine = function() {
      this.render({ engine: 'haml' });
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
      controller._invoke('renderWithEngine');
    });
    
    it.skip('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('text/html');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/render_with_engine.html.haml');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('specific template', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.renderTemplate = function() {
      this.render('show');
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
      controller._invoke('renderTemplate');
    });
    
    it.skip('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('text/html');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/show.html.ejs');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('specific template with format option', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.renderTemplateWithFormat = function() {
      this.render('show', { format: 'json' });
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
      controller._invoke('renderTemplateWithFormat');
    });
    
    it('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('application/json');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/show.json.ejs');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('specific template path', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.renderTemplatePath = function() {
      this.render('other/show');
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
      controller._invoke('renderTemplatePath');
    });
    
    it.skip('should set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.equal('text/html');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('other/show.html.ejs');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('to callback', function() {
    var app = new MockApplication();
    var req, res;
    
    before(function(done) {
      var controller = new Controller();
      controller.renderToCallback = function() {
        this.render(function() {
          return done();
        });
      }
      
      req = new MockRequest();
      res = new MockResponse(function() {
        return done(new Error('should not call res#end'));
      });
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('renderToCallback');
    });
    
    it('should not set content-type header', function() {
      expect(res.getHeader('Content-Type')).to.be.undefined;
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/render_to_callback.html.ejs');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
});
