var helpers = require('../../../lib/locomotive/helpers/dynamic');
  

describe('helpers/dynamic', function() {
  
  it('should export URL helpers', function() {
    expect(helpers.urlFor).to.be.a('function');
  });
  
});
