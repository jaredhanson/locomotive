/* global describe, it, expect */

var helpers = require('../../lib/helpers/url');
  

describe('helpers/url', function() {
  
  describe('linkTo', function() {
    it('should build correct tag with URL', function() {
      expect(helpers.linkTo('/account')).to.equal('<a href="/account">/account</a>');
    });
    it('should build correct tag with URL and text', function() {
      expect(helpers.linkTo('/account', 'My Account')).to.equal('<a href="/account">My Account</a>');
    });
    it('should build correct tag with URL and options', function() {
      expect(helpers.linkTo('/account', { rel: 'me' })).to.equal('<a rel="me" href="/account">/account</a>');
    });
    it('should build correct tag with URL, text, and options', function() {
      expect(helpers.linkTo('/account', 'My Account', { rel: 'me' })).to.equal('<a rel="me" href="/account">My Account</a>');
    });
    it('should encode URLs with spaces', function() {
      expect(helpers.linkTo('/foo bar/', 'Foo Bar')).to.equal('<a href="/foo%20bar/">Foo Bar</a>');
    });
    it('should escape text', function() {
      expect(helpers.linkTo('/foo-bar/', 'Foo & Bar')).to.equal('<a href="/foo-bar/">Foo &amp; Bar</a>');
      expect(helpers.linkTo('/foo-bar/', 'Foo < Bar')).to.equal('<a href="/foo-bar/">Foo &lt; Bar</a>');
      expect(helpers.linkTo('/foo-bar/', 'Foo > Bar')).to.equal('<a href="/foo-bar/">Foo &gt; Bar</a>');
      expect(helpers.linkTo('/foo-bar/', '"Foo Bar"')).to.equal('<a href="/foo-bar/">&quot;Foo Bar&quot;</a>');
    });
  });
  
  describe('mailTo', function() {
    it('should build correct tag with email', function() {
      expect(helpers.mailTo('johndoe@example.com')).to.equal('<a href="mailto:johndoe@example.com">johndoe@example.com</a>');
    });
    it('should build correct tag with email and options', function() {
      expect(helpers.mailTo('johndoe@example.com', { class: 'email' })).to.equal('<a class="email" href="mailto:johndoe@example.com">johndoe@example.com</a>');
    });
    it('should build correct tag with email and text', function() {
      expect(helpers.mailTo('johndoe@example.com', 'John Doe')).to.equal('<a href="mailto:johndoe@example.com">John Doe</a>');
    });
    it('should build correct tag with email, text, and options', function() {
      expect(helpers.mailTo('johndoe@example.com', 'John Doe', { class: 'email' })).to.equal('<a class="email" href="mailto:johndoe@example.com">John Doe</a>');
    });
    it('should encode URLs with spaces', function() {
      expect(helpers.mailTo('john doe@example.com', 'John Doe')).to.equal('<a href="mailto:john%20doe@example.com">John Doe</a>');
    });
    it('should escape text', function() {
      expect(helpers.mailTo('parents@example.com', 'Mom & Dad')).to.equal('<a href="mailto:parents@example.com">Mom &amp; Dad</a>');
    });
  });
  
});
