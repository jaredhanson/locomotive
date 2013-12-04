var helpers = require('../../../lib/helpers/dynamic');
  

describe('helpers/dynamic', function() {
  
  it('should export URL helpers', function() {
    expect(helpers.urlFor).to.be.a('function');
  });
  
});
