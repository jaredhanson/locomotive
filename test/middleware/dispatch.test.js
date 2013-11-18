var chai = require('chai')
  , dispatch = require('../../lib/locomotive/middleware/dispatch');


function MockApplication() {
  this._controllers = {};
}

MockApplication.prototype._controller = function(id, cb) {
  var ctrl = this._controllers[id];
  if (!ctrl) {
    return cb(new Error("Unable to create controller '" + id + "'"));
  }
  return cb(null, ctrl);
}


function ReqResController() {
}

ReqResController.prototype._prepare = function(req, res, next) {
  this.req = req;
  this.res = res;
  this.next = next;
}

ReqResController.prototype._invoke = function(action) {
  this.res.end(this.req.url + ' -> ' + action);
}


function NextController() {
}

NextController.prototype._prepare = function(req, res, next) {
  this.req = req;
  this.res = res;
  this.next = next;
}

NextController.prototype._invoke = function(action) {
  this.next();
}




describe('middleware/dispatch', function() {
  
  it('should be named dispatch', function() {
    expect(dispatch().name).to.equal('dispatch');
  });
  
  describe('dispatching to controller that uses req and res', function() {
    var request, response;
    
    var app = new MockApplication()
      , controller = new ReqResController();
    app._controllers['robots'] = controller;

    before(function(done) {
      chai.connect(dispatch(app, 'robots', 'beepBoop'))
        .req(function(req) {
          request = req;
          req.url = '/robots/noise';
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
    it('should respond', function() {
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.equal('/robots/noise -> beepBoop');
    });
  });
  
  describe('dispatching to controller that uses next', function() {
    var error;
    
    var app = new MockApplication()
      , controller = new NextController();
    app._controllers['robots'] = controller;

    before(function(done) {
      chai.connect(dispatch(app, 'robots', 'beepBoop'))
        .next(function(err) {
          error = err;
          done();
        })
        .dispatch();
    });
    
    it('should call next without error', function() {
      expect(error).to.be.undefined;
    });
  });
  
  describe('dispatching to non-existant controller', function() {
    var error;
    
    var app = new MockApplication();

    before(function(done) {
      chai.connect(dispatch(app, 'invalid', 'index'))
        .next(function(err) {
          error = err;
          done();
        })
        .dispatch();
    });
    
    it('should error', function() {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.equal("Unable to create controller 'invalid'");
    });
  });
  
});
