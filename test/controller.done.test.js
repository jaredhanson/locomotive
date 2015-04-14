/* global describe, it, before, expect */

var Controller = require('../lib/controller')
  , MockApplication = require('./mocks/application')
  , MockRequest = require('./mocks/request')
  , MockResponse = require('./mocks/response');



describe('Controller#done', function() {
  
  describe('from controller that has after filter', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.order = [];
    
    controller.show = function() {
      this.done();
    };
    controller.after('show', function(next) {
      this.order.push(1);
      next();
    });
    
    var req, res;
    
    before(function(done) {
      req = new MockRequest();
      res = new MockResponse();

      controller.after('show', function () {
        return done();
      });
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('show');
    });
    
    it('should apply after filters', function() {
      expect(controller.order).to.have.length(1);
      expect(controller.order[0]).to.equal(1);
    });
  });
  
  describe('from controller that has after filter which ends response', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.order = [];
    controller.show = function() {
      this.done();
    };
    controller.after('show', function () {
      this.order.push(1);
      res.end();
    });
    
    var req, res;
    
    before(function(done) {
      req = new MockRequest();
      res = new MockResponse(function() {
        done();
      });
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('show');
    });
    
    it('should apply after filters', function() {
      expect(controller.order).to.have.length(1);
      expect(controller.order[0]).to.equal(1);
    });
  });
  
});
