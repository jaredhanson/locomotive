var chai = require('chai')
  , patternHelper = require('../../../lib/helpers/route/pattern');
  

describe('helpers/route/pattern', function() {
  
  describe('path', function() {
    
    describe('without placeholder', function() {
      var pathHelper;
    
      before(function(done) {
        chai.locomotive.helper(patternHelper.path('/songs'), 'test', 'show')
          .req(function(req) {
            req.headers.host = 'www.example.com';
          })
          .create(function(err, helper) {
            if (err) { return done(err); }
            pathHelper = helper;
            return done();
          });
      });
    
      it('should build correct path', function() {
        expect(pathHelper()).to.equal('/songs');
      });
    });
    
    describe('with one placeholder', function() {
      var pathHelper;
    
      before(function(done) {
        chai.locomotive.helper(patternHelper.path('/songs/:id'), 'test', 'show')
          .req(function(req) {
            req.headers.host = 'www.example.com';
          })
          .create(function(err, helper) {
            if (err) { return done(err); }
            pathHelper = helper;
            return done();
          });
      });
    
      it('should build correct path with number', function() {
        expect(pathHelper(7)).to.equal('/songs/7');
        expect(pathHelper(0)).to.equal('/songs/0');
      });
      it('should build correct path with string', function() {
        expect(pathHelper('mr-jones')).to.equal('/songs/mr-jones');
      });
      it('should build correct path with object id', function() {
        expect(pathHelper({ id: 101 })).to.equal('/songs/101');
        expect(pathHelper({ id: 0 })).to.equal('/songs/0');
      });
      it('should throw if incorrect number of arguments', function() {
        expect(function() {
          pathHelper()
        }).to.throw("Incorrect number of arguments passed to route helper for /songs/:id");
      });
    });
    
    describe('with two placeholders', function() {
      var pathHelper;
    
      before(function(done) {
        chai.locomotive.helper(patternHelper.path('/bands/:band_id/albums/:id'), 'test', 'show')
          .req(function(req) {
            req.headers.host = 'www.example.com';
          })
          .create(function(err, helper) {
            if (err) { return done(err); }
            pathHelper = helper;
            return done();
          });
      });
    
      it('should build correct path with number', function() {
        expect(pathHelper(7, 8)).to.equal('/bands/7/albums/8');
        expect(pathHelper(0, 8)).to.equal('/bands/0/albums/8');
        expect(pathHelper(7, 0)).to.equal('/bands/7/albums/0');
        expect(pathHelper(0, 0)).to.equal('/bands/0/albums/0');
      });
      it('should build correct path with string', function() {
        expect(pathHelper('counting-crows', 'august-and-everything-after')).to.equal('/bands/counting-crows/albums/august-and-everything-after');
      });
      it('should build correct path with object id', function() {
        expect(pathHelper({ id: 101 }, { id: 202 })).to.equal('/bands/101/albums/202');
        expect(pathHelper({ id: 0 }, { id: 202 })).to.equal('/bands/0/albums/202');
        expect(pathHelper({ id: 101 }, { id: 0 })).to.equal('/bands/101/albums/0');
        expect(pathHelper({ id: 0 }, { id: 0 })).to.equal('/bands/0/albums/0');
      });
      it('should throw if incorrect number of arguments', function() {
        expect(function() {
          pathHelper(7)
        }).to.throw("Incorrect number of arguments passed to route helper for /bands/:band_id/albums/:id");
      });
    });
    
  });
  
});
