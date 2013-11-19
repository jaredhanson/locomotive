var Controller = require('../lib/locomotive/controller')
  , MockApplication = require('./mocks/application')
  , MockRequest = require('./mocks/request')
  , MockResponse = require('./mocks/response');



describe('Controller#respond', function() {
  
  it('should be aliased to respondWith', function() {
    expect(Controller.prototype.respond).to.equal(Controller.prototype.respondWith);
  });
  
  describe('based on mime type using function', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.respondUsingFunctionKeyedByMimeType = function() {
      var self = this;
      this.respond({
        'application/json': function() { self.render({ format: 'json', engine: 'jsonb' }); },
        'application/xml': function() { self.render({ format: 'xml', engine: 'xmlb' }); }
      });
    }
    
    var req, res;
    
    before(function(done) {
      req = new MockRequest();
      req.accepts = function(keys) {
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
  
});
