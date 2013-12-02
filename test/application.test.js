var locomotive = require('..')
  , Application = require('../lib/locomotive/application')

describe('Application', function() {
  
  describe('#format', function() {
    var app = new Application();
    
    it('should register format to engine as string argument', function() {
      app.format('json', 'jsonb');
      expect(Object.keys(app._formats)).to.have.length(1);
      expect(app._formats['json']).to.be.an('object');
      expect(app._formats['json'].engine).to.equal('jsonb');
      expect(app._formats['json'].extension).to.be.undefined;
    });
    
    it('should register format to engine as option', function() {
      app.format('xml', { engine: 'xmlb' });
      expect(Object.keys(app._formats)).to.have.length(2);
      expect(app._formats['xml']).to.be.an('object');
      expect(app._formats['xml'].engine).to.equal('xmlb');
      expect(app._formats['xml'].extension).to.be.undefined;
    });
    
    it('should register format to explicit extension as option', function() {
      app.format('html', { extension: '.jade' });
      expect(Object.keys(app._formats)).to.have.length(3);
      expect(app._formats['html']).to.be.an('object');
      expect(app._formats['html'].extension).to.equal('.jade');
      expect(app._formats['html'].engine).to.be.undefined;
    });
    
    it('should register type to engine as option', function() {
      app.format('text/plain', { engine: 'txtb' });
      expect(Object.keys(app._formats)).to.have.length(4);
      expect(app._formats['txt']).to.be.an('object');
      expect(app._formats['txt'].engine).to.equal('txtb');
      expect(app._formats['txt'].extension).to.be.undefined;
    });
  });
  
  describe('#helper', function() {
    it('should be aliased to helpers', function() {
      var app = new Application();
      expect(app.helper).to.equal(app.helpers);
    });
    
    it('should register by name', function() {
      var app = new Application();
      app.helper('loremIpsum', function() { return 'lorem'; });
      
      expect(Object.keys(app._helpers)).to.have.length(1);
      expect(app._helpers.loremIpsum).to.be.an('function');
      expect(app._helpers.loremIpsum()).to.equal('lorem');
      
      expect(Object.keys(app._dynamicHelpers)).to.have.length(0);
    });
    
    it('should register by object', function() {
      var app = new Application();
      var helpers = {};
      helpers.loremIpsum = function() { return 'lorem'; };
      helpers.dolorSit = function() { return 'dolor'; };
      app.helpers(helpers);
      
      expect(Object.keys(app._helpers)).to.have.length(2);
      expect(app._helpers.loremIpsum).to.be.an('function');
      expect(app._helpers.loremIpsum()).to.equal('lorem');
      expect(app._helpers.dolorSit).to.be.an('function');
      expect(app._helpers.dolorSit()).to.equal('dolor');
      
      expect(Object.keys(app._dynamicHelpers)).to.have.length(0);
    });
    
    it('should register by object with dynamic helpers', function() {
      var app = new Application();
      var helpers = {};
      helpers.loremIpsum = function() { return 'lorem'; };
      helpers.dolorSit = function() { return 'dolor'; };
      helpers.dynamic = {};
      helpers.dynamic.latinPhrases = function(req, res) { return 'dynLatin'; };
      app.helpers(helpers);
      
      expect(Object.keys(app._helpers)).to.have.length(2);
      expect(app._helpers.loremIpsum).to.be.an('function');
      expect(app._helpers.loremIpsum()).to.equal('lorem');
      expect(app._helpers.dolorSit).to.be.an('function');
      expect(app._helpers.dolorSit()).to.equal('dolor');
      
      expect(Object.keys(app._dynamicHelpers)).to.have.length(1);
      expect(app._dynamicHelpers.latinPhrases).to.be.an('function');
      expect(app._dynamicHelpers.latinPhrases()).to.equal('dynLatin');
    });
  });
  
  describe('#dynamicHelper', function() {
    it('should be aliased to dynamicHelpers', function() {
      var app = new Application();
      expect(app.dynamicHelper).to.equal(app.dynamicHelpers);
    });
    
    it('should register by name', function() {
      var app = new Application();
      app.dynamicHelper('loremIpsum', function(req, res) { return 'dynLorem'; });
      
      expect(Object.keys(app._dynamicHelpers)).to.have.length(1);
      expect(app._dynamicHelpers.loremIpsum).to.be.an('function');
      expect(app._dynamicHelpers.loremIpsum()).to.equal('dynLorem');
      
      expect(Object.keys(app._helpers)).to.have.length(0);
    });
    
    it('should register by object', function() {
      var app = new Application();
      var helpers = {};
      helpers.loremIpsum = function(req, res) { return 'dynLorem'; };
      helpers.dolorSit = function(req, res) { return 'dynDolor'; };
      app.dynamicHelpers(helpers);
      
      expect(Object.keys(app._dynamicHelpers)).to.have.length(2);
      expect(app._dynamicHelpers.loremIpsum).to.be.an('function');
      expect(app._dynamicHelpers.loremIpsum()).to.equal('dynLorem');
      expect(app._dynamicHelpers.dolorSit).to.be.an('function');
      expect(app._dynamicHelpers.dolorSit()).to.equal('dynDolor');
      
      expect(Object.keys(app._helpers)).to.have.length(0);
    });
  });
  
});
