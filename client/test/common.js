
require('sinon');
require('sinon-as-promised');

import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import dirtyChai from 'dirty-chai';

chai.use(chaiEnzyme());
chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.use(dirtyChai);
