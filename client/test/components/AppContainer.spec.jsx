import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import EventSource from '../../app/sources/EventSource';
import DefaultProps from '../factories/DefaultProps';

import AppContainer from '../../app/components/AppContainer';
import SideNav from '../../app/components/layout/SideNav';

describe('<AppContainer />', () => {
  sinon.stub(EventSource, 'fetch').resolves([]);
  const props = DefaultProps.build();

  before(() => {
    proxyquire('../../app/sources/EventSource', EventSource);
  });

  after(() => {
    EventSource.fetch.restore();
  });

  afterEach(() => {
    EventSource.fetch.reset();
  });

  it('prefetches events', () => {
    mount(<AppContainer {...props} />);
    expect(EventSource.fetch).to.have.been.calledOnce;
  });

  describe('refresh', () => {
    it('updates events', () => {
      const wrapper = shallow(<AppContainer {...props} />);
      wrapper.find(SideNav).simulate('refresh');
      expect(EventSource.fetch).to.have.been.calledOnce;
    });
  });
});
