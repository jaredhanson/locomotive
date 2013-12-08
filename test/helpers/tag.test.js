/* global describe, it, expect */

var helpers = require('../../lib/helpers/tag');
  

describe('helpers/tag', function() {
  
  describe('tag', function() {
    it('should build correct tag', function() {
      expect(helpers.tag('br')).to.equal('<br>');
    });
    it('should build correct tag with close argument in second position', function() {
      expect(helpers.tag('br', true)).to.equal('<br/>');
    });
    it('should build correct tag with options argument in second position', function() {
      expect(helpers.tag('img', { src: '/image.png', width: 100, height: 60 })).to.equal('<img src="/image.png" width="100" height="60">');
    });
    it('should build correct tag with options argument in second position and close argument in third position', function() {
      expect(helpers.tag('img', { src: '/image.png', width: 100, height: 60 }, true)).to.equal('<img src="/image.png" width="100" height="60"/>');
    });
    it('should build correct tag with callback argument in second position', function() {
      expect(helpers.tag('p', function() { return 'hello'; })).to.equal('<p>hello</p>');
    });
    it('should build correct tag with options argument in second position and callback argument in third position', function() {
      expect(helpers.tag('p', { id: 'intro' }, function() { return 'hello'; })).to.equal('<p id="intro">hello</p>');
    });
    
    it('should build correct tag when callback does not return a value', function() {
      expect(helpers.tag('p', function() {})).to.equal('<p/>');
    });
    it('should build correct tag when callback returns an empty string', function() {
      expect(helpers.tag('p', function() { return ''; })).to.equal('<p/>');
    });
    
    it('should build correct tag with multiple nested tag calls', function() {
      expect(helpers.tag('ul', function() { return helpers.tag('li', function() { return 'item'; }); })).to.equal('<ul><li>item</li></ul>');
    });
  });
  
  
  describe('openTag', function() {
    it('should build correct tag', function() {
      expect(helpers.openTag('br')).to.equal('<br>');
    });
    it('should build correct tag with options', function() {
      expect(helpers.openTag('img', { src: '/image.png', width: 100, height: 60 })).to.equal('<img src="/image.png" width="100" height="60">');
    });
  });
  
  
  describe('closeTag', function() {
    it('should build correct tag', function() {
      expect(helpers.closeTag('p')).to.equal('</p>');
    });
  });
  
});
