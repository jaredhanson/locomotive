var chai = require('chai')
  , invokable = require('../../lib/locomotive/middleware/invokable');


function MockApplication() {
  this._controllers = {};
}

MockApplication.prototype._controller = function(id, cb) {
  var ctrl = this._controllers[id];
  if (!ctrl) {
    return cb(new Error("Unable to create controller '" + id + "'"));
  }
  return cb(null, new ctrl());
}


function ReqResController() {
}

ReqResController.prototype._init = function(app, id) {
  this.__app = app;
  this.__id = id;
}

ReqResController.prototype._prepare = function(req, res, next) {
  this.req = req;
  this.res = res;
  this.next = next;
}

ReqResController.prototype._invoke = function(action) {
  this.res.end(this.req.url + ' -> ' + this.__id + '#' + action);
}



describe('middleware/invokable', function() {

  it('should be named invokable', function() {
    expect(invokable().name).to.equal('invokable');
  });
  
  describe('invoking with controller and action', function() {
    var test, request, response;
    
    var app = new MockApplication()
    app._controllers['robots'] = ReqResController;

    before(function(done) {
      test = chai.connect(invokable(app));
      test
        .req(function(req) {
          request = req;
          req.url = '/robots/noise';
        })
        .res(function(res) {
          response = res;
        })
        .next(function(err) {
          if (err) { return done(err); }
          done();
        })
        .dispatch();
    });
    
    it('should expose invoke on request', function() {
      expect(request.invoke).to.be.a('function');
    });
    
    describe('calling invoke', function() {
      before(function(done) {
        test.end(function() {
          done();
        });
        
        request.invoke('robots', 'beepBoop', function(err) {
          if (err) { return done(err); }
          return done(new Error('should not call next'))
        });
      });
      
      it('should respond', function() {
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.equal('/robots/noise -> robots#beepBoop');
      });
    });
  });
  
  describe('invoking with namespaced controller and action using Ruby style', function() {
    var test, request, response;
    
    var app = new MockApplication()
    app._controllers['admin/foo'] = ReqResController;

    before(function(done) {
      test = chai.connect(invokable(app));
      test
        .req(function(req) {
          request = req;
          req.url = '/admin/fbb';
        })
        .res(function(res) {
          response = res;
        })
        .next(function(err) {
          if (err) { return done(err); }
          done();
        })
        .dispatch();
    });
    
    it('should expose invoke on request', function() {
      expect(request.invoke).to.be.a('function');
    });
    
    describe('calling invoke', function() {
      before(function(done) {
        test.end(function() {
          done();
        });
        
        request.invoke('Admin::FooController', 'bar_baz', function(err) {
          if (err) { return done(err); }
          return done(new Error('should not call next'))
        });
      });
      
      it('should respond', function() {
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.equal('/admin/fbb -> admin/foo#barBaz');
      });
    });
  });

});
