/* global describe, it, before, expect */

var Controller = require('../lib/controller')
  , MockApplication = require('./mocks/application')
  , MockRequest = require('./mocks/request')
  , MockResponse = require('./mocks/response');



describe('Controller#param', function() {
  
  it('should be aliased to params', function() {
    expect(Controller.prototype.param).to.equal(Controller.prototype.params);
  });
  
  describe('with value from request and default value', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.show = function() {
      this.id = this.param('id');
      this.fullText = this.param('full_text', 'true');
      this.render();
    };
    
    var req, res;
    
    before(function(done) {
      req = new MockRequest();
      req.params.id = '1234';
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('show');
    });
    
    it('should render view', function() {
      expect(res._view).to.equal('test/show.html.ejs');
    });
    
    it('should assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(2);
      expect(res.locals.id).to.equal('1234');
      expect(res.locals.fullText).to.equal('true');
    });
  });
  
});
