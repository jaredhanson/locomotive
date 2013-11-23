var Controller = require('../lib/locomotive/controller')
  , MockApplication = require('./mocks/application')
  , MockRequest = require('./mocks/request')
  , MockResponse = require('./mocks/response');



describe('Controller#error', function() {
  
  describe('with error', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.redirectWithUrl = function() {
      this.error(new Error('something went wrong'));
    }
    
    var req, res, error;
    
    before(function(done) {
      req = new MockRequest();
      res = new MockResponse(function() {
        return done(new Error('should not call res#end'));
      });
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        error = err;
        return done();
      });
      controller._invoke('redirectWithUrl');
    });
    
    it('should next with error', function() {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.be.equal('something went wrong');
    });
  });
  
  describe('implicitly due to exception', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.causeTypeError = function() {
      this.lol.wat;
    }
    
    var req, res, error;
    
    before(function(done) {
      req = new MockRequest();
      res = new MockResponse(function() {
        return done(new Error('should not call res#end'));
      });
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        error = err;
        return done();
      });
      controller._invoke('causeTypeError');
    });
    
    it('should next with error', function() {
      expect(error).to.be.an.instanceOf(TypeError);
      expect(error.message).to.match(/wat/);
    });
  });
  
  describe('implicitly due to exception with non-matching after filter', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.causeTypeError = function() {
      this.lol.wat;
    }
    controller.after('index', function(next) {
      return next();
    });
    
    var req, res, error;
    
    before(function(done) {
      req = new MockRequest();
      res = new MockResponse(function() {
        return done(new Error('should not call res#end'));
      });
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        error = err;
        return done();
      });
      controller._invoke('causeTypeError');
    });
    
    it('should next with error', function() {
      expect(error).to.be.an.instanceOf(TypeError);
      expect(error.message).to.match(/wat/);
    });
  });
  
});
