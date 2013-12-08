/* global describe, it, before, expect */

var chai = require('chai')
  , helpers = require('../../../lib/helpers/dynamic/url');
  

describe('helpers/dynamic/url', function() {
  
  describe('urlFor', function() {
    
    describe('request with host header', function() {
      var urlFor;
    
      before(function(done) {
        chai.locomotive.dynamicHelper(helpers.urlFor, 'test', 'show')
          .app(function(app) {
            app.route('/test', 'test', 'index');
            app.route('/animals/:id', 'animals', 'show');
            app.route('/ns/fulano-sutano/show', 'fulanoSutano/fooBar', 'showSomething');
          
            app.helper('animalURL', function(obj) {
              return this.urlFor({ controller: 'animals', action: 'show', id: obj.id });
            });
            app.helper('animalPath', function(obj) {
              return this.urlFor({ controller: 'animals', action: 'show', id: obj.id, onlyPath: true });
            });
          })
          .req(function(req) {
            req.headers.host = 'www.example.com';
          })
          .create(function(err, helper) {
            if (err) { return done(err); }
            urlFor = helper;
            return done();
          });
      });
    
      it('should build correct URL for protocol, host, and pathname', function() {
        expect(urlFor({ protocol: 'https', host: 'www.example.net', pathname: 'welcome' })).to.equal('https://www.example.net/welcome');
      });
    
      it('should build correct URL for action of current controller', function() {
        expect(urlFor({ action: 'index' })).to.equal('http://www.example.com/test');
      });
      it('should build correct path for action of current controller', function() {
        expect(urlFor({ action: 'index', onlyPath: true })).to.equal('/test');
      });
      it('should build correct URL for action of current controller using protocol and host options', function() {
        expect(urlFor({ action: 'index', protocol: 'https', host: 'www.example.net' })).to.equal('https://www.example.net/test');
      });
    
      it('should build correct URL for controller action with resource ID', function() {
        expect(urlFor({ controller: 'animals', action: 'show', id: '1234' })).to.equal('http://www.example.com/animals/1234');
      });
      
      it('should build correct URL for namespaced controller action using Ruby style', function() {
        expect(urlFor({ controller: 'FulanoSutano::FooBar', action: 'show_something' })).to.equal('http://www.example.com/ns/fulano-sutano/show');
      });
    
      it('should invoke routing helper to build URL when given an object', function() {
        function Animal() {}
        var animal = new Animal();
        animal.id = '123';
      
        expect(urlFor(animal)).to.equal('http://www.example.com/animals/123');
      });
      it('should invoke routing helper to build path when given an object', function() {
        function Animal() {}
        var animal = new Animal();
        animal.id = '123';
      
        expect(urlFor(animal, { onlyPath: true })).to.equal('/animals/123');
      });
    
      it('should throw if unknown controller action specified', function() {
        expect(function() {
          urlFor({ controller: 'unknown', action: 'unknown' });
        }).to.throw("No route to 'unknown#unknown'");
      });
      it('should throw if routing helper unavailable for object', function() {
        expect(function() {
          function Dog() {}
          var dog = new Dog();
        
          urlFor(dog);
        }).to.throw("No routing helper named 'dogURL'");
      });
      it('should throw if unable to determine type of record', function() {
        expect(function() {
          urlFor('unknown-record');
        }).to.throw("Unable to determine record type of 'String'");
      });
    });
    
    describe('request without host header', function() {
      var urlFor;
    
      before(function(done) {
        chai.locomotive.dynamicHelper(helpers.urlFor, 'test', 'show')
          .app(function(app) {
            app.route('/test', 'test', 'index');
            app.route('/animals/:id', 'animals', 'show');
          
            app.helper('animalURL', function(obj) {
              return this.urlFor({ controller: 'animals', action: 'show', id: obj.id });
            });
            app.helper('animalPath', function(obj) {
              return this.urlFor({ controller: 'animals', action: 'show', id: obj.id, onlyPath: true });
            });
          })
          .create(function(err, helper) {
            if (err) { return done(err); }
            urlFor = helper;
            return done();
          });
      });
    
      it('should build best effort URL for action of current controller', function() {
        expect(urlFor({ action: 'index' })).to.equal('/test');
      });
      it('should build best effort URL for controller action with resource ID', function() {
        expect(urlFor({ controller: 'animals', action: 'show', id: '1234' })).to.equal('/animals/1234');
      });
      it('should invoke routing helper to build best effort URL when given an object', function() {
        function Animal() {}
        var animal = new Animal();
        animal.id = '123';
      
        expect(urlFor(animal)).to.equal('/animals/123');
      });
    });
    
    describe('secure request with host header', function() {
      var urlFor;
    
      before(function(done) {
        chai.locomotive.dynamicHelper(helpers.urlFor, 'test', 'show')
          .app(function(app) {
            app.route('/test', 'test', 'index');
            app.route('/animals/:id', 'animals', 'show');
          
            app.helper('animalURL', function(obj) {
              return this.urlFor({ controller: 'animals', action: 'show', id: obj.id });
            });
            app.helper('animalPath', function(obj) {
              return this.urlFor({ controller: 'animals', action: 'show', id: obj.id, onlyPath: true });
            });
          })
          .req(function(req) {
            req.protocol = 'https';
            req.headers.host = 'www.example.com';
          })
          .create(function(err, helper) {
            if (err) { return done(err); }
            urlFor = helper;
            return done();
          });
      });
    
      it('should build correct URL for action of current controller', function() {
        expect(urlFor({ action: 'index' })).to.equal('https://www.example.com/test');
      });
      it('should build correct URL for controller action with resource ID', function() {
        expect(urlFor({ controller: 'animals', action: 'show', id: '1234' })).to.equal('https://www.example.com/animals/1234');
      });
      it('should invoke routing helper to build URL when given an object', function() {
        function Animal() {}
        var animal = new Animal();
        animal.id = '123';
      
        expect(urlFor(animal)).to.equal('https://www.example.com/animals/123');
      });
    });
      
  });
  
});
