/* global describe, it, before, expect */

var Controller = require('../lib/controller')
  , MockApplication = require('./mocks/application')
  , MockRequest = require('./mocks/request')
  , MockResponse = require('./mocks/response');
  

describe('Controller#before', function() {

  describe('filters declared above action, that use data arguments', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.order = [];

    controller.before('index', function(next) {
      var data = {
        store: 'Amoeba Music'
      };
      this.order.push('x');
      next(null, data);
    });
    controller.before('show', function(next) {
      var data = {
        band: 'Counting Crows'
      };
      this.order.push(1);
      next(null, data);
    });
    controller.before('show', function(data, next) {
      data.album = 'August and Everything After';
      this.order.push(2);
      next(null, data);
    });
    controller.show = function(data) {
      this.order.push('a');
      this.song = 'Mr. Jones';
      this._private = 'Untitled';
      this.band = data.band;
      this.album = data.album;
      this.render();
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
      controller._invoke('show');
    });

    it('should apply filters in correct order', function() {
      expect(controller.order).to.have.length(3);
      expect(controller.order[0]).to.equal(1);
      expect(controller.order[1]).to.equal(2);
      expect(controller.order[2]).to.equal('a');
    });

    it('should render view without options', function() {
      expect(res._view).to.equal('test/show.html.ejs');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });

    it('should assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(3);
      expect(res.locals.band).to.equal('Counting Crows');
      expect(res.locals.album).to.equal('August and Everything After');
      expect(res.locals.song).to.equal('Mr. Jones');
    });
  });
  
  describe('filters declared below action, that use data arguments', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.order = [];

    controller.show = function(data) {
      this.order.push('a');
      this.song = 'Mr. Jones';
      this.band = data.band;
      this.album = data.album;
      this.store = data.store; //undefined
      this.render();
    }
    controller.before('show', function(next) {
      var data = {
        band: 'Counting Crows'
      };
      this.order.push(1);
      next(null, data);
    });
    controller.before('show', function(data, next) {
      data.album = 'August and Everything After';
      this.order.push(2);
      next(null, data);
    });
    controller.before('index', function(next) {
      var data = {
        store: 'Amoeba Music'
      };
      this.order.push('x');
      next(null, data);
    });

    var req, res;

    before(function(done) {
      req = new MockRequest();
      res = new MockResponse(done);

      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('show');
    });

    it('should apply filters in correct order', function() {
      expect(controller.order).to.have.length(3);
      expect(controller.order[0]).to.equal(1);
      expect(controller.order[1]).to.equal(2);
      expect(controller.order[2]).to.equal('a');
    });

    it('should render view without options', function() {
      expect(res._view).to.equal('test/show.html.ejs');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });

    it('should assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(4);
      expect(res.locals.band).to.equal('Counting Crows');
      expect(res.locals.album).to.equal('August and Everything After');
      expect(res.locals.song).to.equal('Mr. Jones');
      expect(res.locals.store).to.be.undefined;
    });
  });
  
  describe('filters for multiple actions, declared above action, that use data arguments', function() {
    var app = new MockApplication();
    var proto = new Controller();

    proto.before('index', function(next) {
      var data = {
        store: 'Amoeba Music'
      };
      this.order.push('x');
      next(null, data);
    });
    proto.index = function(data) {
      this.order.push('a');
      this.store = data.store;
      this.address = 'Berkeley, CA';
      this.render();
    }
    proto.before(['theDoors', 'strangeDays'], function(next) {
      var data = {
        band: 'The Doors'
      };
      this.order.push(1);
      next(null, data);
    });
    proto.theDoors = function(data) {
      this.order.push('a');
      this.band = data.band;
      this.song = 'Break On Through (To the Other Side)';
      this.render();
    }
    proto.strangeDays = function(data) {
      this.order.push('a');
      this.band = data.band;
      this.song = 'Love Me Two Times';
      this.render();
    }

    describe('invoking first action', function() {
      var controller = Object.create(proto);
      controller.order = [];
      var req, res;

      before(function(done) {
        req = new MockRequest();
        res = new MockResponse(done);

        controller._init(app, 'test');
        controller._prepare(req, res, function(err) {
          if (err) { return done(err); }
          return done(new Error('should not call next'));
        });
        controller._invoke('theDoors');
      });

      it('should apply filters in correct order', function() {
        expect(controller.order).to.have.length(2);
        expect(controller.order[0]).to.equal(1);
        expect(controller.order[1]).to.equal('a');
      });

      it('should render view without options', function() {
        expect(res._view).to.equal('test/the_doors.html.ejs');
        expect(res._options).to.be.an('object');
        expect(Object.keys(res._options)).to.have.length(0);
      });

      it('should assign locals', function() {
        expect(res.locals).to.be.an('object');
        expect(Object.keys(res.locals)).to.have.length(2);
        expect(res.locals.band).to.equal('The Doors');
        expect(res.locals.song).to.equal('Break On Through (To the Other Side)');
      });
    });

    describe('invoking second action', function() {
      var controller = Object.create(proto);
      controller.order = [];
      var req, res;

      before(function(done) {
        req = new MockRequest();
        res = new MockResponse(done);

        controller._init(app, 'test');
        controller._prepare(req, res, function(err) {
          if (err) { return done(err); }
          return done(new Error('should not call next'));
        });
        controller._invoke('strangeDays');
      });

      it('should apply filters in correct order', function() {
        expect(controller.order).to.have.length(2);
        expect(controller.order[0]).to.equal(1);
        expect(controller.order[1]).to.equal('a');
      });

      it('should render view without options', function() {
        expect(res._view).to.equal('test/strange_days.html.ejs');
        expect(res._options).to.be.an('object');
        expect(Object.keys(res._options)).to.have.length(0);
      });

      it('should assign locals', function() {
        expect(res.locals).to.be.an('object');
        expect(Object.keys(res.locals)).to.have.length(2);
        expect(res.locals.band).to.equal('The Doors');
        expect(res.locals.song).to.equal('Love Me Two Times');
      });
    });

    describe('invoking unrelated action', function() {
      var controller = Object.create(proto);
      controller.order = [];
      var req, res;

      before(function(done) {
        req = new MockRequest();
        res = new MockResponse(done);

        controller._init(app, 'test');
        controller._prepare(req, res, function(err) {
          if (err) { return done(err); }
          return done(new Error('should not call next'));
        });
        controller._invoke('index');
      });

      it('should apply filters in correct order', function() {
        expect(controller.order).to.have.length(2);
        expect(controller.order[0]).to.equal('x');
        expect(controller.order[1]).to.equal('a');
      });

      it('should render view without options', function() {
        expect(res._view).to.equal('test/index.html.ejs');
        expect(res._options).to.be.an('object');
        expect(Object.keys(res._options)).to.have.length(0);
      });

      it('should assign locals', function() {
        expect(res.locals).to.be.an('object');
        expect(Object.keys(res.locals)).to.have.length(2);
        expect(res.locals.store).to.equal('Amoeba Music');
        expect(res.locals.address).to.equal('Berkeley, CA');
      });
    });
  });
  
  describe('filters for multiple actions, declared below action, that use data arguments', function() {
    var app = new MockApplication();
    var proto = new Controller();

    proto.theDoors = function(data) {
      this.order.push('a');
      this.band = data.band;
      this.song = 'Break On Through (To the Other Side)';
      this.render();
    }
    proto.strangeDays = function(data) {
      this.order.push('a');
      this.band = data.band;
      this.song = 'Love Me Two Times';
      this.render();
    }
    proto.before(['theDoors', 'strangeDays'], function(next) {
      var data = {
        band: 'The Doors'
      };
      this.order.push(1);
      next(null, data);
    });
    proto.index = function(data) {
      this.order.push('a');
      this.store = data.store;
      this.address = 'Berkeley, CA';
      this.render();
    }
    proto.before('index', function(next) {
      var data = {
        store: 'Amoeba Music'
      };
      this.order.push('x');
      next(null, data);
    });

    describe('invoking first action', function() {
      var controller = Object.create(proto);
      controller.order = [];
      var req, res;

      before(function(done) {
        req = new MockRequest();
        res = new MockResponse(done);

        controller._init(app, 'test');
        controller._prepare(req, res, function(err) {
          if (err) { return done(err); }
          return done(new Error('should not call next'));
        });
        controller._invoke('theDoors');
      });

      it('should apply filters in correct order', function() {
        expect(controller.order).to.have.length(2);
        expect(controller.order[0]).to.equal(1);
        expect(controller.order[1]).to.equal('a');
      });

      it('should render view without options', function() {
        expect(res._view).to.equal('test/the_doors.html.ejs');
        expect(res._options).to.be.an('object');
        expect(Object.keys(res._options)).to.have.length(0);
      });

      it('should assign locals', function() {
        expect(res.locals).to.be.an('object');
        expect(Object.keys(res.locals)).to.have.length(2);
        expect(res.locals.band).to.equal('The Doors');
        expect(res.locals.song).to.equal('Break On Through (To the Other Side)');
      });
    });

    describe('invoking second action', function() {
      var controller = Object.create(proto);
      controller.order = [];
      var req, res;

      before(function(done) {
        req = new MockRequest();
        res = new MockResponse(done);

        controller._init(app, 'test');
        controller._prepare(req, res, function(err) {
          if (err) { return done(err); }
          return done(new Error('should not call next'));
        });
        controller._invoke('strangeDays');
      });

      it('should apply filters in correct order', function() {
        expect(controller.order).to.have.length(2);
        expect(controller.order[0]).to.equal(1);
        expect(controller.order[1]).to.equal('a');
      });

      it('should render view without options', function() {
        expect(res._view).to.equal('test/strange_days.html.ejs');
        expect(res._options).to.be.an('object');
        expect(Object.keys(res._options)).to.have.length(0);
      });

      it('should assign locals', function() {
        expect(res.locals).to.be.an('object');
        expect(Object.keys(res.locals)).to.have.length(2);
        expect(res.locals.band).to.equal('The Doors');
        expect(res.locals.song).to.equal('Love Me Two Times');
      });
    });

    describe('invoking unrelated action', function() {
      var controller = Object.create(proto);
      controller.order = [];
      var req, res;

      before(function(done) {
        req = new MockRequest();
        res = new MockResponse(done);

        controller._init(app, 'test');
        controller._prepare(req, res, function(err) {
          if (err) { return done(err); }
          return done(new Error('should not call next'));
        });
        controller._invoke('index');
      });

      it('should apply filters in correct order', function() {
        expect(controller.order).to.have.length(2);
        expect(controller.order[0]).to.equal('x');
        expect(controller.order[1]).to.equal('a');
      });

      it('should render view without options', function() {
        expect(res._view).to.equal('test/index.html.ejs');
        expect(res._options).to.be.an('object');
        expect(Object.keys(res._options)).to.have.length(0);
      });

      it('should assign locals', function() {
        expect(res.locals).to.be.an('object');
        expect(Object.keys(res.locals)).to.have.length(2);
        expect(res.locals.store).to.equal('Amoeba Music');
        expect(res.locals.address).to.equal('Berkeley, CA');
      });
    });
  });
  
  describe('filters for all actions declared above action, that use data arguments', function() {
    var app = new MockApplication();
    var proto = new Controller();

    proto.before('index', function(data, next) {
      data = data || {};
      this.order.push('x');
      data.store = 'Amoeba Music';
      next(null, data);
    });
    proto.index = function(data) {
      this.order.push('a');
      this.address = 'Berkeley, CA';
      this.store = data.store;
      this.band = data.band;
      this.render();
    }
    proto.before('*', function(data, next) {
      data = data || {};
      data.band = 'The Doors';
      this.order.push(1);
      next(null, data);
    });
    proto.theDoors = function(data) {
      this.order.push('a');
      this.song = 'Break On Through (To the Other Side)';
      this.band = data.band;
      this.render();
    }
    proto.strangeDays = function(data) {
      this.order.push('a');
      this.song = 'Love Me Two Times';
      this.band = data.band;
      this.render();
    }

    describe('invoking first action', function() {
      var controller = Object.create(proto);
      controller.order = [];
      var req, res;

      before(function(done) {
        req = new MockRequest();
        res = new MockResponse(done);

        controller._init(app, 'test');
        controller._prepare(req, res, function(err) {
          if (err) { return done(err); }
          return done(new Error('should not call next'));
        });
        controller._invoke('theDoors');
      });

      it('should apply filters in correct order', function() {
        expect(controller.order).to.have.length(2);
        expect(controller.order[0]).to.equal(1);
        expect(controller.order[1]).to.equal('a');
      });

      it('should render view without options', function() {
        expect(res._view).to.equal('test/the_doors.html.ejs');
        expect(res._options).to.be.an('object');
        expect(Object.keys(res._options)).to.have.length(0);
      });

      it('should assign locals', function() {
        expect(res.locals).to.be.an('object');
        expect(Object.keys(res.locals)).to.have.length(2);
        expect(res.locals.band).to.equal('The Doors');
        expect(res.locals.song).to.equal('Break On Through (To the Other Side)');
      });
    });

    describe('invoking second action', function() {
      var controller = Object.create(proto);
      controller.order = [];
      var req, res;

      before(function(done) {
        req = new MockRequest();
        res = new MockResponse(done);

        controller._init(app, 'test');
        controller._prepare(req, res, function(err) {
          if (err) { return done(err); }
          return done(new Error('should not call next'));
        });
        controller._invoke('strangeDays');
      });

      it('should apply filters in correct order', function() {
        expect(controller.order).to.have.length(2);
        expect(controller.order[0]).to.equal(1);
        expect(controller.order[1]).to.equal('a');
      });

      it('should render view without options', function() {
        expect(res._view).to.equal('test/strange_days.html.ejs');
        expect(res._options).to.be.an('object');
        expect(Object.keys(res._options)).to.have.length(0);
      });

      it('should assign locals', function() {
        expect(res.locals).to.be.an('object');
        expect(Object.keys(res.locals)).to.have.length(2);
        expect(res.locals.band).to.equal('The Doors');
        expect(res.locals.song).to.equal('Love Me Two Times');
      });
    });

    describe('invoking related action', function() {
      var controller = Object.create(proto);
      controller.order = [];
      var req, res;

      before(function(done) {
        req = new MockRequest();
        res = new MockResponse(done);

        controller._init(app, 'test');
        controller._prepare(req, res, function(err) {
          if (err) { return done(err); }
          return done(new Error('should not call next'));
        });
        controller._invoke('index');
      });

      it('should apply filters in correct order', function() {
        expect(controller.order).to.have.length(3);
        expect(controller.order[0]).to.equal('x');
        expect(controller.order[1]).to.equal(1);
        expect(controller.order[2]).to.equal('a');
      });

      it('should render view without options', function() {
        expect(res._view).to.equal('test/index.html.ejs');
        expect(res._options).to.be.an('object');
        expect(Object.keys(res._options)).to.have.length(0);
      });

      it('should assign locals', function() {
        expect(res.locals).to.be.an('object');
        expect(Object.keys(res.locals)).to.have.length(3);
        expect(res.locals.store).to.equal('Amoeba Music');
        expect(res.locals.address).to.equal('Berkeley, CA');
        expect(res.locals.band).to.equal('The Doors');
      });
    });
  });
  
  describe('filters for all actions, declared below action, that use data arguments', function() {
    var app = new MockApplication();
    var proto = new Controller();

    proto.theDoors = function(data) {
      this.order.push('a');
      this.song = 'Break On Through (To the Other Side)';
      this.band = data.band;
      this.render();
    }
    proto.strangeDays = function(data) {
      this.order.push('a');
      this.song = 'Love Me Two Times';
      this.band = data.band;
      this.render();
    }
    proto.before('*', function(data, next) {
      data = data || {};
      this.order.push(1);
      data.band = 'The Doors';
      next(null, data);
    });
    proto.index = function(data) {
      this.order.push('a');
      this.address = 'Berkeley, CA';
      this.store = data.store;
      this.band = data.band;
      this.render();
    }
    proto.before('index', function(data, next) {
      data = data || {};
      this.order.push('x');
      data.store = 'Amoeba Music';
      next(null, data);
    });

    describe('invoking first action', function() {
      var controller = Object.create(proto);
      controller.order = [];
      var req, res;

      before(function(done) {
        req = new MockRequest();
        res = new MockResponse(done);

        controller._init(app, 'test');
        controller._prepare(req, res, function(err) {
          if (err) { return done(err); }
          return done(new Error('should not call next'));
        });
        controller._invoke('theDoors');
      });

      it('should apply filters in correct order', function() {
        expect(controller.order).to.have.length(2);
        expect(controller.order[0]).to.equal(1);
        expect(controller.order[1]).to.equal('a');
      });

      it('should render view without options', function() {
        expect(res._view).to.equal('test/the_doors.html.ejs');
        expect(res._options).to.be.an('object');
        expect(Object.keys(res._options)).to.have.length(0);
      });

      it('should assign locals', function() {
        expect(res.locals).to.be.an('object');
        expect(Object.keys(res.locals)).to.have.length(2);
        expect(res.locals.band).to.equal('The Doors');
        expect(res.locals.song).to.equal('Break On Through (To the Other Side)');
      });
    });

    describe('invoking second action', function() {
      var controller = Object.create(proto);
      controller.order = [];
      var req, res;

      before(function(done) {
        req = new MockRequest();
        res = new MockResponse(done);

        controller._init(app, 'test');
        controller._prepare(req, res, function(err) {
          if (err) { return done(err); }
          return done(new Error('should not call next'));
        });
        controller._invoke('strangeDays');
      });

      it('should apply filters in correct order', function() {
        expect(controller.order).to.have.length(2);
        expect(controller.order[0]).to.equal(1);
        expect(controller.order[1]).to.equal('a');
      });

      it('should render view without options', function() {
        expect(res._view).to.equal('test/strange_days.html.ejs');
        expect(res._options).to.be.an('object');
        expect(Object.keys(res._options)).to.have.length(0);
      });

      it('should assign locals', function() {
        expect(res.locals).to.be.an('object');
        expect(Object.keys(res.locals)).to.have.length(2);
        expect(res.locals.band).to.equal('The Doors');
        expect(res.locals.song).to.equal('Love Me Two Times');
      });
    });

    describe('invoking related action', function() {
      var controller = Object.create(proto);
      controller.order = [];
      var req, res;

      before(function(done) {
        req = new MockRequest();
        res = new MockResponse(done);

        controller._init(app, 'test');
        controller._prepare(req, res, function(err) {
          if (err) { return done(err); }
          return done(new Error('should not call next'));
        });
        controller._invoke('index');
      });

      it('should apply filters in correct order', function() {
        expect(controller.order).to.have.length(3);
        expect(controller.order[0]).to.equal(1);
        expect(controller.order[1]).to.equal('x');
        expect(controller.order[2]).to.equal('a');
      });

      it('should render view without options', function() {
        expect(res._view).to.equal('test/index.html.ejs');
        expect(res._options).to.be.an('object');
        expect(Object.keys(res._options)).to.have.length(0);
      });

      it('should assign locals', function() {
        expect(res.locals).to.be.an('object');
        expect(Object.keys(res.locals)).to.have.length(3);
        expect(res.locals.store).to.equal('Amoeba Music');
        expect(res.locals.address).to.equal('Berkeley, CA');
        expect(res.locals.band).to.equal('The Doors');
      });
    });
  });
  
  describe('filter chain with data arguments that halts due to error', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.order = [];

    controller.before('show', function(next) {
      this.order.push(1);
      var data = {
        band: 'Counting Crows'
      }
      next(new Error('something went wrong'), data);
    });
    controller.before('show', function(data, next) {
      this.order.push(2);
      data.album = 'August and Everything After';
      next(null, data);
    });
    controller.show = function(data) {
      this.order.push('a');
      this.song = 'Mr. Jones';
      this.album = data.album;
      this.band = data.band;
      this.render();
    }

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
      controller._invoke('show');
    });

    it('should next with error', function() {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.be.equal('something went wrong');
    });

    it('should apply filters in correct order', function() {
      expect(controller.order).to.have.length(1);
      expect(controller.order[0]).to.equal(1);
    });

    it('should not render view', function() {
      expect(res._view).to.be.undefined;
      expect(res._options).to.be.undefined;
    });

    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
  describe('filter chain with data arguments that halts due to exception', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.order = [];

    controller.before('show', function(next) {
      this.order.push(1);
      var data = {
        band: 'Counting Crows'
      };
      throw new Error('something was thrown');
    });
    controller.before('show', function(data, next) {
      this.order.push(2);
      data.album = 'August and Everything After';
      next(null, data);
    });
    controller.show = function(data) {
      this.order.push('a');
      this.song = 'Mr. Jones';
      this.album = data.album;
      this.band = data.band;
      this.render();
    }

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
      controller._invoke('show');
    });

    it('should next with error', function() {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.be.equal('something was thrown');
    });

    it('should apply filters in correct order', function() {
      expect(controller.order).to.have.length(1);
      expect(controller.order[0]).to.equal(1);
    });

    it('should not render view', function() {
      expect(res._view).to.be.undefined;
      expect(res._options).to.be.undefined;
    });

    it('should not assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(0);
    });
  });
  
});
