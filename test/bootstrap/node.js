var chai = require('chai');

chai.use(require('chai-connect-middleware'));
chai.use(require('@viadeo-fcms/chai-maglev-helpers'));

global.expect = chai.expect;
