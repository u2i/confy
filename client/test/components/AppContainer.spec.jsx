import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import shared from 'mocha-shared';
import EventFactory from 'test/factories/Event';
import EventSource from 'sources/EventSource';
import DefaultProps from 'test/factories/DefaultProps';

import AppContainer from 'components/AppContainer';
import SideNav from 'components/layout/SideNav';

describe('<AppContainer />', () => {
  sinon.stub(EventSource, 'fetch').resolves([]);
  sinon.stub(EventSource, 'remove').resolves([]);
  let props;

  shared.setup('stub ReactDOM.findDOMNode');

  before(() => {
    proxyquire('../../app/sources/EventSource', EventSource);
  });

  beforeEach(() => {
    props = DefaultProps.build();
  });

  after(() => {
    EventSource.fetch.restore();
    EventSource.remove.restore();
  });

  afterEach(() => {
    EventSource.fetch.reset();
    EventSource.remove.reset();
  });

  it('prefetches events', () => {
    mount(<AppContainer {...props} />);
    expect(EventSource.fetch).to.have.been.calledOnce();
  });

  describe('refresh', () => {
    it('updates events', () => {
      const wrapper = shallow(<AppContainer {...props} />);
      wrapper.find(SideNav).simulate('refresh');
      expect(EventSource.fetch).to.have.been.calledOnce();
    });
  });

  describe('delete', () => {
    before(() => {
      document.querySelector = function querySelector(_e) {
        return { content: 'xxx' };
      };
    });

    it('deletes event', () => {
      const event = EventFactory.build({ creator: { self: true, email: 'user@example.com' } });
      props = DefaultProps.build({ initialEvents: [event] });
      const wrapper = mount(<AppContainer {...props} />);
      wrapper.find('.delete-button').simulate('click');
      expect(EventSource.remove).to.have.been.calledWith(event.id);
    });
  });
});
