var Controller = require('../lib/locomotive/controller')
  , MockApplication = require('./mocks/application')
  , MockRequest = require('./mocks/request')
  , MockResponse = require('./mocks/response');



describe('Controller#render', function() {
  var app = new MockApplication();
  var controller = new Controller();
  
  controller.renderWithoutArguments = function() {
    this.render();
  }
  
  describe('without arguments', function() {
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
    
    it('should not render with callback', function() {
      expect(res._fn).to.be.undefined;
    });
  });
  
});
