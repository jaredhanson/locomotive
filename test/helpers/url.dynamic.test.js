/* global describe, it, before, expect */

var chai = require('chai')
  , helpers = require('../../lib/helpers/url')
  , dynamicHelpers = require('../../lib/helpers/dynamic');
  

describe('helpers/url', function() {
  
  describe('linkTo (route awareness)', function() {
    
    describe('request with host header', function() {
      var linkTo;
      
      before(function(done) {
        chai.maglev.helper(helpers.linkTo, 'test', 'show')
          .app(function(app) {
            app.route('/profile', 'profile', 'show');
            app.route('/animals/:id', 'animals', 'show');
            
            app.helper('animalURL', function(obj) {
              return this.urlFor({ controller: 'animals', action: 'show', id: obj.id });
            });
            app.helper('animalPath', function(obj) {
              return this.urlFor({ controller: 'animals', action: 'show', id: obj.id, onlyPath: true });
            });
            app.dynamicHelper('urlFor', dynamicHelpers.urlFor);
          })
          .req(function(req) {
            req.headers.host = 'www.example.com';
          })
          .create(function(err, helper) {
            if (err) { return done(err); }
            linkTo = helper;
            return done();
          });
      });
    
      it('should build correct tag to controller action with text', function() {
        expect(linkTo({ controller: 'profile', action: 'show' }, 'Profile')).to.equal('<a href="http://www.example.com/profile">Profile</a>');
        expect(linkTo({ controller: 'ProfileController', action: 'show' }, 'Profile')).to.equal('<a href="http://www.example.com/profile">Profile</a>');
      });
      it('should build correct tag to controller action with text and attributes', function() {
        expect(linkTo({ controller: 'profile', action: 'show' }, 'Profile', { rel: 'me' })).to.equal('<a rel="me" href="http://www.example.com/profile">Profile</a>');
        expect(linkTo({ controller: 'ProfileController', action: 'show' }, 'Profile', { rel: 'me' })).to.equal('<a rel="me" href="http://www.example.com/profile">Profile</a>');
      });
      it('should build correct tag to object', function() {
        function Animal() {}
        var animal = new Animal();
        animal.id = '123';
      
        expect(linkTo(animal, 'An Animal')).to.equal('<a href="http://www.example.com/animals/123">An Animal</a>');
        expect(linkTo(animal, 'An Animal', { rel: 'pet' })).to.equal('<a rel="pet" href="http://www.example.com/animals/123">An Animal</a>');
      });
    });
    
  });
  
});
