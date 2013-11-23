var Controller = require('../lib/locomotive/controller')
  , MockApplication = require('./mocks/application')
  , MockController = require('./mocks/controller')
  , MockRequest = require('./mocks/request')
  , MockResponse = require('./mocks/response');



describe('Controller#invoke', function() {
  
  describe('with controller and action', function() {
    var app = new MockApplication();
    otherController = new MockController();
    app._controllers['other'] = otherController;
    
    var controller = new Controller();
    controller.withControllerAndAction = function() {
      this.invoke('other', 'show');
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
      controller._invoke('withControllerAndAction');
    });
    
    it('should initialize other controller', function() {
      expect(otherController.__app).to.equal(app);
      expect(otherController.__id).to.equal('other');
    });
    
    it('should respond', function() {
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.equal('/ -> other#show');
    });
  });
  
});
