
import ReactDOM from 'react-dom';

import sinon from 'sinon';
import chai from 'chai';
import proxyquire from 'proxyquire';
import shared from 'mocha-shared';

chai.use(require('chai-enzyme')());
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
chai.use(require('dirty-chai'));

chai.config.showDiff = true;
chai.config.truncateThreshold = 0;

require('sinon-as-promised');

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

require.extensions['.md'] = () => null;
