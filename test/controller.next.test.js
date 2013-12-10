/* global describe, it, before, expect */

var Controller = require('../lib/controller')
  , MockApplication = require('./mocks/application')
  , MockRequest = require('./mocks/request')
  , MockResponse = require('./mocks/response');



describe('Controller#next', function() {
  
  describe('without arguments', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.redirectWithUrl = function() {
      this.next();
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
      controller._invoke('redirectWithUrl');
    });
    
    it('should next without error', function() {
      expect(error).to.be.undefined;
    });
  });
  
  describe('without arguments and after filter', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.order = [];
    
    controller.redirectWithUrl = function() {
      this.next();
    };
    controller.after('redirectWithUrl', function(next) {
      this.order.push(1);
      next();
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
      controller._invoke('redirectWithUrl');
    });
    
    it('should next without error', function() {
      expect(error).to.be.undefined;
    });
    it('should apply after filters', function() {
      expect(controller.order).to.have.length(1);
      expect(controller.order[0]).to.equal(1);
    });
  });
  
  describe('without arguments and after filter that ends response', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.order = [];
    
    controller.redirectWithUrl = function() {
      this.next();
    };
    controller.after('redirectWithUrl', function(next) {
      this.order.push(1);
      res.end();
    });
    
    var req, res;
    
    before(function(done) {
      req = new MockRequest();
      res = new MockResponse(function() {
        return done();
      });
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('redirectWithUrl');
    });
    
    it('should apply after filters', function() {
      expect(controller.order).to.have.length(1);
      expect(controller.order[0]).to.equal(1);
    });
  });
  
  describe('with error', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.redirectWithUrl = function() {
      this.next(new Error('something went wrong'));
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
      controller._invoke('redirectWithUrl');
    });
  
    it('should next with error', function() {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.be.equal('something went wrong');
    });
  });
  
  describe('with error and after error filter', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.order = [];
    
    controller.redirectWithUrl = function() {
      this.next(new Error('something went wrong'));
    };
    controller.after('redirectWithUrl', function(err, req, res, next) {
      this.order.push({ i: 1, message: err.message });
      next(err);
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
      controller._invoke('redirectWithUrl');
    });
    
    it('should apply after filters', function() {
      expect(controller.order).to.have.length(1);
      expect(controller.order[0].i).to.equal(1);
      expect(controller.order[0].message).to.equal('something went wrong');
    });
    it('should next with error', function() {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.be.equal('something went wrong');
    });
  });
  
  describe('with error and after error filter that ends response', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.order = [];
    
    controller.redirectWithUrl = function() {
      this.next(new Error('something went wrong'));
    };
    controller.after('redirectWithUrl', function(err, req, res, next) {
      this.order.push({ i: 1, message: err.message });
      res.end();
    });
    
    var req, res;
    
    before(function(done) {
      req = new MockRequest();
      res = new MockResponse(function() {
        return done();
      });
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('redirectWithUrl');
    });
    
    it('should apply after filters', function() {
      expect(controller.order).to.have.length(1);
      expect(controller.order[0].i).to.equal(1);
      expect(controller.order[0].message).to.equal('something went wrong');
    });
  });
  
});
