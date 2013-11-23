var Controller = require('../lib/locomotive/controller')
  , MockApplication = require('./mocks/application')
  , MockController = require('./mocks/controller')
  , MockRequest = require('./mocks/request')
  , MockResponse = require('./mocks/response');



describe('Controller#invoke', function() {
  
  describe('with shorthand notation', function() {
    var app = new MockApplication();
    var otherController = new MockController();
    app._controllers['lorem'] = otherController;
    
    var controller = new Controller();
    controller.withShorthandNotation = function() {
      this.invoke('lorem#ipsum');
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
      controller._invoke('withShorthandNotation');
    });
    
    it('should initialize other controller', function() {
      expect(otherController.__app).to.equal(app);
      expect(otherController.__id).to.equal('lorem');
    });
    
    it('should respond', function() {
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.equal('/ -> lorem#ipsum');
    });
  });
  
  describe('with action', function() {
    var app = new MockApplication();
    var otherController = new MockController();
    app._controllers['test'] = otherController;
    
    var controller = new Controller();
    controller.withAction = function() {
      this.invoke('show');
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
      controller._invoke('withAction');
    });
    
    it('should initialize other controller', function() {
      expect(otherController.__app).to.equal(app);
      expect(otherController.__id).to.equal('test');
    });
    
    it('should respond', function() {
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.equal('/ -> test#show');
    });
  });
  
  describe('with controller and action', function() {
    var app = new MockApplication();
    var otherController = new MockController();
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
  
  describe('with namespaced controller and action', function() {
    var app = new MockApplication();
    var otherController = new MockController();
    app._controllers['admin/other'] = otherController;
    
    var controller = new Controller();
    controller.withNamespacedControllerAndAction = function() {
      this.invoke('admin/other', 'show');
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
      controller._invoke('withNamespacedControllerAndAction');
    });
    
    it('should initialize other controller', function() {
      expect(otherController.__app).to.equal(app);
      expect(otherController.__id).to.equal('admin/other');
    });
    
    it('should respond', function() {
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.equal('/ -> admin/other#show');
    });
  });
  
  describe('with namespaced controller and action using snake case style', function() {
    var app = new MockApplication();
    var otherController = new MockController();
    app._controllers['fulanoSutano/fooBar'] = otherController;
    
    var controller = new Controller();
    controller.withNamespacedControllerAndActionUsingSnakeCaseStyle = function() {
      this.invoke('fulano_sutano/foo_bar', 'show');
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
      controller._invoke('withNamespacedControllerAndActionUsingSnakeCaseStyle');
    });
    
    it('should initialize other controller', function() {
      expect(otherController.__app).to.equal(app);
      expect(otherController.__id).to.equal('fulanoSutano/fooBar');
    });
    
    it('should respond', function() {
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.equal('/ -> fulanoSutano/fooBar#show');
    });
  });
  
  describe('with namespaced controller and action using snake case style ending with controller', function() {
    var app = new MockApplication();
    var otherController = new MockController();
    app._controllers['fulanoSutano/fooBar'] = otherController;
    
    var controller = new Controller();
    controller.withNamespacedControllerAndActionUsingSnakeCaseControllerStyle = function() {
      this.invoke('fulano_sutano/foo_bar_controller', 'show');
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
      controller._invoke('withNamespacedControllerAndActionUsingSnakeCaseControllerStyle');
    });
    
    it('should initialize other controller', function() {
      expect(otherController.__app).to.equal(app);
      expect(otherController.__id).to.equal('fulanoSutano/fooBar');
    });
    
    it('should respond', function() {
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.equal('/ -> fulanoSutano/fooBar#show');
    });
  });
  
  describe('with namespaced controller and action using Ruby style', function() {
    var app = new MockApplication();
    var otherController = new MockController();
    app._controllers['fulanoSutano/fooBar'] = otherController;
    
    var controller = new Controller();
    controller.withNamespacedControllerAndActionUsingRubyStyle = function() {
      this.invoke('FulanoSutano::FooBar', 'show');
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
      controller._invoke('withNamespacedControllerAndActionUsingRubyStyle');
    });
    
    it('should initialize other controller', function() {
      expect(otherController.__app).to.equal(app);
      expect(otherController.__id).to.equal('fulanoSutano/fooBar');
    });
    
    it('should respond', function() {
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.equal('/ -> fulanoSutano/fooBar#show');
    });
  });
  
  describe('with namespaced controller and action using Ruby style ending with controller', function() {
    var app = new MockApplication();
    var otherController = new MockController();
    app._controllers['fulanoSutano/fooBar'] = otherController;
    
    var controller = new Controller();
    controller.withNamespacedControllerAndActionUsingRubyControllerStyle = function() {
      this.invoke('FulanoSutano::FooBarController', 'show');
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
      controller._invoke('withNamespacedControllerAndActionUsingRubyControllerStyle');
    });
    
    it('should initialize other controller', function() {
      expect(otherController.__app).to.equal(app);
      expect(otherController.__id).to.equal('fulanoSutano/fooBar');
    });
    
    it('should respond', function() {
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.equal('/ -> fulanoSutano/fooBar#show');
    });
  });
  
});
