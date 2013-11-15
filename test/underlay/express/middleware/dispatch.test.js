var chai = require('chai')
  , dispatch = require('../../../../lib/locomotive/underlay/express/middleware/dispatch');


function MockApplication() {
  this._controllers = {};
}

MockApplication.prototype.controller = function(name, controller) {
  if (controller) {
    this._controllers[name] = controller;
    return this;
  }
  return this._controllers[name];
}


function MockController(cb) {
  this._prep = cb;
}

MockController.prototype._init = function(req, res, next) {
  if (req.method !== 'GET') { throw new Error('Controller initialized with invalid request'); }
  if (typeof res.setHeader !== 'function') { throw new Error('Controller initialized with invalid response'); }
  if (typeof next !== 'function') { throw new Error('Controller initialized with invalid next function'); }
  
  if (this._prep) { this._prep(this); }
  
  this.req = req;
  this.res = res;
  this.next = next;
}

MockController.prototype._invoke = function(action) {
  this.res.end('Invoked action: ' + action);
}




describe('middleware/dispatch', function() {
  
  it('should be named dispatch', function() {
    expect(dispatch().name).to.equal('dispatch');
  });
  
  describe('dispatching to controller prototype', function() {
    var controller, request, response;
    
    var app = new MockApplication();
    var proto = new MockController(function(ctl) {
      controller = ctl;
    });
    app.controller('foo', proto);

    before(function(done) {
      chai.connect(dispatch(app, 'foo', 'bar'))
        .req(function(req) {
          request = req;
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
    it('should create instance from prototype', function() {
      expect(controller.__proto__).to.equal(proto);
      expect(controller).to.be.an.instanceOf(MockController);
    });
    
    it('should respond', function() {
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.equal('Invoked action: bar');
    });
  });
  
  describe('dispatching to non-existant controller', function() {
    var err;
    
    var app = new MockApplication();

    before(function(done) {
      chai.connect(dispatch(app, 'invalid', 'index'))
        .req(function(req) {
          request = req;
        })
        .next(function(e) {
          err = e;
          done();
        })
        .dispatch();
    });
    
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('RouterError');
      expect(err.message).to.equal('No controller for invalid#index');
    });
  });
  
});
