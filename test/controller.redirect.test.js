/* global describe, it, before, expect */

var Controller = require('../lib/controller')
  , MockApplication = require('./mocks/application')
  , MockRequest = require('./mocks/request')
  , MockResponse = require('./mocks/response');



describe('Controller#redirect', function() {
  
  describe('with url', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.redirectWithUrl = function() {
      this.redirect('/home');
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
      controller._invoke('redirectWithUrl');
    });
    
    it('should set status code', function() {
      expect(res.statusCode).to.equal(302);
    });
    
    it('should set location header', function() {
      expect(res.getHeader('Location')).to.equal('/home');
    });
  });
  
  describe('with url and status code', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.redirectWithUrlAndStatusCode = function() {
      this.redirect('/home', 303);
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
      controller._invoke('redirectWithUrlAndStatusCode');
    });
    
    it('should set status code', function() {
      expect(res.statusCode).to.equal(303);
    });
    
    it('should set location header', function() {
      expect(res.getHeader('Location')).to.equal('/home');
    });
  });
  
  describe('with status code and url', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.redirectWithUrlAndStatusCode = function() {
      this.redirect(303, '/home');
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
      controller._invoke('redirectWithUrlAndStatusCode');
    });
    
    it('should set status code', function() {
      expect(res.statusCode).to.equal(303);
    });
    
    it('should set location header', function() {
      expect(res.getHeader('Location')).to.equal('/home');
    });
  });
  
});
