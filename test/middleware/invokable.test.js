/* global describe, it, before, expect */

var chai = require('chai')
  , invokable = require('../../lib/middleware/invokable');


function MockApplication() {
  this._controllers = {};
}

MockApplication.prototype._controller = function(id, cb) {
  var ctrl = this._controllers[id];
  if (!ctrl) {
    return cb(new Error("Unable to create controller '" + id + "'"));
  }
  return cb(null, new ctrl());
};


function ReqResController() {
}

ReqResController.prototype._init = function(app, id) {
  this.__app = app;
  this.__id = id;
};

ReqResController.prototype._prepare = function(req, res, next) {
  this.req = req;
  this.res = res;
  this.next = next;
};

ReqResController.prototype._invoke = function(action) {
  this.res.end(this.req.url + ' -> ' + this.__id + '#' + action);
};

function NextController() {
}

NextController.prototype._init = function(app, id) {
  this.__app = app;
  this.__id = id;
};

NextController.prototype._prepare = function(req, res, next) {
  this.req = req;
  this.res = res;
  this.next = next;
};

NextController.prototype._invoke = function(action) {
  this.next();
};

function ErrorController() {
}

ErrorController.prototype._init = function(app, id) {
  this.__app = app;
  this.__id = id;
};

ErrorController.prototype._prepare = function(req, res, next) {
  this.req = req;
  this.res = res;
  this.next = next;
};

ErrorController.prototype._invoke = function(action) {
  this.next(new Error('something went horribly wrong'));
};



describe('middleware/invokable', function() {

  it('should be named invokable', function() {
    expect(invokable().name).to.equal('invokable');
  });
  
  describe('invoking with controller and action', function() {
    var test, request, response;
    
    var app = new MockApplication();
    app._controllers['robots'] = ReqResController;

    before(function(done) {
      test = chai.connect.use(invokable(app));
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
          return done(new Error('should not call next'));
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
    
    var app = new MockApplication();
    app._controllers['admin/foo'] = ReqResController;

    before(function(done) {
      test = chai.connect.use(invokable(app));
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
          return done(new Error('should not call next'));
        });
      });
      
      it('should respond', function() {
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.equal('/admin/fbb -> admin/foo#barBaz');
      });
    });
  });
  
  describe('invoking with shorthand notation', function() {
    var test, request, response;
    
    var app = new MockApplication();
    app._controllers['lorem'] = ReqResController;

    before(function(done) {
      test = chai.connect.use(invokable(app));
      test
        .req(function(req) {
          request = req;
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
        
        request.invoke('lorem#ipsum', function(err) {
          if (err) { return done(err); }
          return done(new Error('should not call next'));
        });
      });
      
      it('should respond', function() {
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.equal('/ -> lorem#ipsum');
      });
    });
  });
  
  
  describe('invoking controller that calls next', function() {
    var test, request, response;
    
    var app = new MockApplication();
    app._controllers['lorem'] = NextController;

    before(function(done) {
      test = chai.connect.use(invokable(app));
      test
        .req(function(req) {
          request = req;
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
        request.invoke('lorem', 'ipsum', function(err) {
          if (err) { return done(err); }
          return done();
        });
      });
      
      it('should next', function() {
        // would fail with a timeout if `done()` were not invoked above
        expect(true).to.equal(true);
      });
    });
  });
  
  describe('invoking controller that calls next with error to invoke that does supply callback', function() {
    var test, request, response;
    
    var app = new MockApplication();
    app._controllers['lorem'] = ErrorController;

    before(function(done) {
      test = chai.connect.use(invokable(app));
      test
        .req(function(req) {
          request = req;
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
      var error;
      
      before(function(done) {
        request.invoke('lorem', 'ipsum', function(err) {
          error = err;
          return done();
        });
      });
      
      it('should next with error', function() {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('something went horribly wrong');
      });
    });
  });
  
  describe('invoking controller that calls next with error to invoke that does not supply callback', function() {
    var test, request, response;
    
    var app = new MockApplication();
    app._controllers['lorem'] = ErrorController;

    before(function(done) {
      test = chai.connect.use(invokable(app));
      test
        .req(function(req) {
          request = req;
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
      
      it('should throw', function() {
        expect(function() {
          request.invoke('lorem', 'ipsum');
        }).to.throw('something went horribly wrong');
      });
    
    });
  });
  
  
  describe('with name option', function() {
    var test, request, response;
    
    var app = new MockApplication();

    before(function(done) {
      test = chai.connect.use(invokable(app, { name: 'invokeit' }));
      test
        .req(function(req) {
          request = req;
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
      expect(request.invokeit).to.be.a('function');
    });
  });

});
