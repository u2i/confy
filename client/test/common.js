
import ReactDOM from 'react-dom';

import sinon from 'sinon';
import chai from 'chai';
import proxyquire from 'proxyquire';
import shared from 'mocha-shared';

import chaiEnzyme from 'chai-enzyme';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import dirtyChai from 'dirty-chai';

require('sinon-as-promised');

chai.use(chaiEnzyme());
chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.use(dirtyChai);

shared.setup('stub ReactDOM.findDOMNode', ({ cb } = {}) => {
  before(() => {
    const node = document.createElement('div');
    const stub = sinon.stub(ReactDOM, 'findDOMNode').returns(node);
    proxyquire('react-dom', ReactDOM);
    if (cb) {
      cb(node, stub);
    }
  });

  after(() => {
    ReactDOM.findDOMNode.restore();
  });
});

