/* global describe, it, before, expect */

var chai = require('chai')
  , routeHelper = require('../../../lib/helpers/route/entry')
  , dynamicHelpers = require('../../../lib/helpers/dynamic');
  

describe('helpers/route/entry', function() {
  
  describe('Path', function() {
  
    describe('without placeholder', function() {
      var pathHelper;
    
      before(function(done) {
        chai.locomotive.helper(routeHelper('songs', 'index', [], true), 'test', 'show')
          .app(function(app) {
            app.route('/songs', 'songs', 'index');
            app.dynamicHelper('urlFor', dynamicHelpers.urlFor);
          })
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
        chai.locomotive.helper(routeHelper('songs', 'show', [ 'id' ], true), 'test', 'show')
          .app(function(app) {
            app.route('/songs/:id', 'songs', 'show');
            app.dynamicHelper('urlFor', dynamicHelpers.urlFor);
          })
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
          pathHelper();
        }).to.throw("Incorrect number of arguments passed to route helper for songs#show");
      });
    });
    
    describe('with two placeholders', function() {
      var pathHelper;
    
      before(function(done) {
        chai.locomotive.helper(routeHelper('albums', 'show', [ 'band_id', 'id' ], true), 'test', 'show')
          .app(function(app) {
            app.route('/bands/:band_id/albums/:id', 'albums', 'show');
            app.dynamicHelper('urlFor', dynamicHelpers.urlFor);
          })
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
          pathHelper(7);
        }).to.throw("Incorrect number of arguments passed to route helper for albums#show");
      });
    });
    
  });
  
  describe('URL', function() {
  
    describe('without placeholder', function() {
      var urlHelper;
    
      before(function(done) {
        chai.locomotive.helper(routeHelper('songs', 'index', []), 'test', 'show')
          .app(function(app) {
            app.route('/songs', 'songs', 'index');
            app.dynamicHelper('urlFor', dynamicHelpers.urlFor);
          })
          .req(function(req) {
            req.headers.host = 'www.example.com';
          })
          .create(function(err, helper) {
            if (err) { return done(err); }
            urlHelper = helper;
            return done();
          });
      });
    
      it('should build correct URL', function() {
        expect(urlHelper()).to.equal('http://www.example.com/songs');
      });
    });
    
    describe('with one placeholder', function() {
      var urlHelper;
    
      before(function(done) {
        chai.locomotive.helper(routeHelper('songs', 'show', [ 'id' ]), 'test', 'show')
          .app(function(app) {
            app.route('/songs/:id', 'songs', 'show');
            app.dynamicHelper('urlFor', dynamicHelpers.urlFor);
          })
          .req(function(req) {
            req.headers.host = 'www.example.com';
          })
          .create(function(err, helper) {
            if (err) { return done(err); }
            urlHelper = helper;
            return done();
          });
      });
    
      it('should build correct URL with number', function() {
        expect(urlHelper(7)).to.equal('http://www.example.com/songs/7');
        expect(urlHelper(0)).to.equal('http://www.example.com/songs/0');
      });
      it('should build correct URL with string', function() {
        expect(urlHelper('mr-jones')).to.equal('http://www.example.com/songs/mr-jones');
      });
      it('should build correct URL with object id', function() {
        expect(urlHelper({ id: 101 })).to.equal('http://www.example.com/songs/101');
        expect(urlHelper({ id: 0 })).to.equal('http://www.example.com/songs/0');
      });
      it('should throw if incorrect number of arguments', function() {
        expect(function() {
          urlHelper();
        }).to.throw("Incorrect number of arguments passed to route helper for songs#show");
      });
    });
    
    describe('with two placeholders', function() {
      var urlHelper;
    
      before(function(done) {
        chai.locomotive.helper(routeHelper('albums', 'show', [ 'band_id', 'id' ]), 'test', 'show')
          .app(function(app) {
            app.route('/bands/:band_id/albums/:id', 'albums', 'show');
            app.dynamicHelper('urlFor', dynamicHelpers.urlFor);
          })
          .req(function(req) {
            req.headers.host = 'www.example.com';
          })
          .create(function(err, helper) {
            if (err) { return done(err); }
            urlHelper = helper;
            return done();
          });
      });
    
      it('should build correct path with number', function() {
        expect(urlHelper(7, 8)).to.equal('http://www.example.com/bands/7/albums/8');
        expect(urlHelper(0, 8)).to.equal('http://www.example.com/bands/0/albums/8');
        expect(urlHelper(7, 0)).to.equal('http://www.example.com/bands/7/albums/0');
        expect(urlHelper(0, 0)).to.equal('http://www.example.com/bands/0/albums/0');
      });
      it('should build correct path with string', function() {
        expect(urlHelper('counting-crows', 'august-and-everything-after')).to.equal('http://www.example.com/bands/counting-crows/albums/august-and-everything-after');
      });
      it('should build correct path with object id', function() {
        expect(urlHelper({ id: 101 }, { id: 202 })).to.equal('http://www.example.com/bands/101/albums/202');
        expect(urlHelper({ id: 0 }, { id: 202 })).to.equal('http://www.example.com/bands/0/albums/202');
        expect(urlHelper({ id: 101 }, { id: 0 })).to.equal('http://www.example.com/bands/101/albums/0');
        expect(urlHelper({ id: 0 }, { id: 0 })).to.equal('http://www.example.com/bands/0/albums/0');
      });
      it('should throw if incorrect number of arguments', function() {
        expect(function() {
          urlHelper(7);
        }).to.throw("Incorrect number of arguments passed to route helper for albums#show");
      });
    });
    
  });
  
});
