/* global describe, it, before, expect */

var Instantiator = require('../lib/instantiator');

describe('Instantiator', function() {
  
  describe('without mechanisms', function() {
    var instantiator = new Instantiator();
    var error;
    
    before(function(done) {
      instantiator.instantiate({}, 'foo', function(err) {
        error = err;
        return done();
      });
    });
    
    it('should error', function() {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.equal("Unable to instantiate 'foo'");
    });
  });
  
  describe('with sync mechanism', function() {
    
    describe('that instantiates', function() {
      var instantiator = new Instantiator();
      instantiator.use(function(mod) {
        return Object.create(mod);
      });
    
      var instance;
    
      before(function(done) {
        instantiator.instantiate({ bar: 'baz' }, 'foo', function(err, inst) {
          if (err) { return done(err); }
          instance = inst;
          return done();
        });
      });
    
      it('should instantiate', function() {
        expect(instance).to.be.an('object');
        expect(instance.bar).to.equal('baz');
      });
    });
    
    describe('that throws an exception', function() {
      var instantiator = new Instantiator();
      instantiator.use(function(mod) {
        throw new Error('something went horribly wrong')
      });
    
      var instance, error;
    
      before(function(done) {
        instantiator.instantiate({ bar: 'baz' }, 'foo', function(err, inst) {
          error = err;
          instance = inst;
          return done();
        });
      });
    
      it('should error', function() {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('something went horribly wrong');
      });
      it('should not instantiate', function() {
        expect(instance).to.be.undefined;
      });
    });
  });
  
  
  describe('with async mechanism', function() {
    
    describe('that instantiates', function() {
      var instantiator = new Instantiator();
      instantiator.use(function(mod, done) {
        process.nextTick(function() {
          return done(null, Object.create(mod));
        });
      });
    
      var instance;
    
      before(function(done) {
        instantiator.instantiate({ bar: 'baz' }, 'foo', function(err, inst) {
          if (err) { return done(err); }
          instance = inst;
          return done();
        });
      });
    
      it('should instantiate', function() {
        expect(instance).to.be.an('object');
        expect(instance.bar).to.equal('baz');
      });
    });
    
    describe('that calls done with error', function() {
      var instantiator = new Instantiator();
      instantiator.use(function(mod, done) {
        process.nextTick(function() {
          return done(new Error('something went wrong'));
        });
      });
    
      var instance, error;
    
      before(function(done) {
        instantiator.instantiate({ bar: 'baz' }, 'foo', function(err, inst) {
          error = err;
          instance = inst;
          return done();
        });
      });
    
      it('should error', function() {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('something went wrong');
      });
      it('should not instantiate', function() {
        expect(instance).to.be.undefined;
      });
    });
    
    describe('that throws an excpetion', function() {
      var instantiator = new Instantiator();
      instantiator.use(function(mod, done) {
        throw new Error('something went horribly wrong');
      });
    
      var instance, error;
    
      before(function(done) {
        instantiator.instantiate({ bar: 'baz' }, 'foo', function(err, inst) {
          error = err;
          instance = inst;
          return done();
        });
      });
    
      it('should error', function() {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('something went horribly wrong');
      });
      it('should not instantiate', function() {
        expect(instance).to.be.undefined;
      });
    });
  });
  
  describe('multiple mechanisms', function() {
    
    describe('the second of which instantiates, first is sync', function() {
      var instantiator = new Instantiator();
      instantiator.use(function(mod) {
        return;
      });
      instantiator.use(function(mod, done) {
        process.nextTick(function() {
          var inst = Object.create(mod);
          inst.attempt = 2;
          return done(null, inst);
        });
      });
    
      var instance;
    
      before(function(done) {
        instantiator.instantiate({ bar: 'baz' }, 'foo', function(err, inst) {
          if (err) { return done(err); }
          instance = inst;
          return done();
        });
      });
    
      it('should instantiate', function() {
        expect(instance).to.be.an('object');
        expect(instance.bar).to.equal('baz');
        expect(instance.attempt).to.equal(2);
      });
    });
    
    describe('the second of which instantiates, first is async', function() {
      var instantiator = new Instantiator();
      instantiator.use(function(mod, done) {
        process.nextTick(function() {
          done();
        });
      });
      instantiator.use(function(mod, done) {
        process.nextTick(function() {
          var inst = Object.create(mod);
          inst.attempt = 2;
          return done(null, inst);
        });
      });
    
      var instance;
    
      before(function(done) {
        instantiator.instantiate({ bar: 'baz' }, 'foo', function(err, inst) {
          if (err) { return done(err); }
          instance = inst;
          return done();
        });
      });
    
      it('should instantiate', function() {
        expect(instance).to.be.an('object');
        expect(instance.bar).to.equal('baz');
        expect(instance.attempt).to.equal(2);
      });
    });
    
    describe('that halt due to error', function() {
      var instantiator = new Instantiator();
      instantiator.use(function(mod, done) {
        process.nextTick(function() {
          done(new Error('something went wrong'));
        });
      });
      instantiator.use(function(mod, done) {
        process.nextTick(function() {
          var inst = Object.create(mod);
          inst.attempt = 2;
          return done(null, inst);
        });
      });
    
      var instance, error;
    
      before(function(done) {
        instantiator.instantiate({ bar: 'baz' }, 'foo', function(err, inst) {
          error = err;
          instance = inst;
          return done();
        });
      });
    
      it('should error', function() {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('something went wrong');
      });
      it('should instantiate', function() {
        expect(instance).to.be.undefined;
      });
    });
  });
  
});
