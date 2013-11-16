var Controller = require('../lib/locomotive/controller');


function MockApplication() {
  this._controllers = {};
}




describe('Controller', function() {
  
  describe('#_load', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller._load(app, 'fooBar');
    
    it('should assign controller app', function() {
      expect(controller.__app).to.equal(app);
    });
    
    it('should assign controller id', function() {
      expect(controller.__id).to.equal('fooBar');
    });
    
    it('should assign controller view dir', function() {
      expect(controller.__viewDir).to.equal('foo_bar');
    });
  });
  
});
