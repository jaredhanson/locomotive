var Controller = require('../lib/locomotive/controller');


function MockApplication() {
  this._controllers = {};
}




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
    
    it('should assign __viewDir', function() {
      expect(controller.__viewDir).to.equal('foo_bar');
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
  
});
