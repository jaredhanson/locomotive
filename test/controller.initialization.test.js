/* global describe, it, before, expect */

var Controller = require('../lib/controller')
  , MockApplication = require('./mocks/application')
  , MockRequest = require('./mocks/request')
  , MockResponse = require('./mocks/response');




describe('Controller', function() {
  
  describe('#_init', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller._init(app, 'fooBar');
    
    it('should assign __app', function() {
      expect(controller.__app).to.equal(app);
    });
    
    it('should assign __id', function() {
      expect(controller.__id).to.equal('fooBar');
    });
  });
  
  describe('#_prepare', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller._init(app, 'fooBar');
    
    var req = { url: '/' };
    var res = { statusCode: 200 };
    var next = function(){};
    controller._prepare(req, res, next);
    
    it('should define app getter', function() {
      expect(controller.app).to.equal(app);
    });
    
    it('should define req getter', function() {
      expect(controller.req).to.equal(req);
      expect(controller.request).to.equal(req);
    });
    
    it('should define res getter', function() {
      expect(controller.res).to.equal(res);
      expect(controller.response).to.equal(res);
    });
  });
  
  describe('#_invoke', function() {
    
    describe('an action that exists', function() {
      var app = new MockApplication();
      var controller = new Controller();
      controller.show = function() {
        this.render();
      };
    
      var req, res;
    
      before(function(done) {
        req = new MockRequest();
        res = new MockResponse(done);
      
        controller._init(app, 'test');
        controller._prepare(req, res, function(err) {
          if (err) { return done(err); }
          return done(new Error('should not call next'));
        });
        controller._invoke('show');
      });
    
      it('should assign _locomotive properties to req', function() {
        expect(req._locomotive).to.be.an('object');
        expect(req._locomotive.app).to.equal(app);
        expect(req._locomotive.controller).to.equal('test');
        expect(req._locomotive.action).to.equal('show');
      });
    });
    
    describe('an action that throws an error', function() {
      var app = new MockApplication();
      var controller = new Controller();
      controller.show = function() {
        throw new Error('something was thrown');
      };
    
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
        controller._invoke('show');
      });
    
      it('should next with error', function() {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.be.equal('something was thrown');
      });
    });
    
    describe('an action that does not exist', function() {
      var app = new MockApplication();
      var controller = new Controller();
      controller.show = function() {
        this.render();
      };
    
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
        controller._invoke('destroy');
      });
    
      it('should next with error', function() {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.constructor.name).to.be.equal('ControllerError');
        expect(error.message).to.be.equal('test#destroy is not a function');
      });
    });
    
  });
  
});
