import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import shared from 'mocha-shared';
import EventSource from 'sources/EventSource';
import DefaultProps from 'test/factories/DefaultProps';
import * as FiltersHelper from 'helpers/FiltersHelper';
import SideNav from 'components/calendar/layout/SideNav';

describe('<CalendarContainer />', () => {
  let props;
  const subscriptionSpy = sinon.spy();

  const CalendarContainer = proxyquire.noCallThru().load('../../../app/components/calendar/CalendarContainer', {
    '../../cable': {
      createSubscription: subscriptionSpy
    }
  }).default;

  shared.setup('stub ReactDOM.findDOMNode');

  before(() => {
    sinon.stub(EventSource, 'fetch').resolves([]);
    sinon.stub(EventSource, 'remove').resolves([]);
    sinon.stub(FiltersHelper, 'loadFilters').returns({ get() { return true; } });
    sinon.stub(FiltersHelper, 'saveFilters');
  });

  beforeEach(() => {
    props = DefaultProps.build();
  });

  after(() => {
    EventSource.fetch.restore();
    EventSource.remove.restore();
    FiltersHelper.loadFilters.restore();
    FiltersHelper.saveFilters.restore();
  });

  beforeEach(() => {
    props = DefaultProps.build();
  });

  afterEach(() => {
    EventSource.fetch.reset();
    EventSource.remove.reset();
  });

  it('subscribes for websocket event notifications', () => {
    mount(<CalendarContainer {...props} />);
    expect(subscriptionSpy).to.have.been.calledOnce();
  });

  it('prefetches events', () => {
    mount(<CalendarContainer {...props} />);
    expect(EventSource.fetch).to.have.been.called();
  });

  describe('refresh', () => {
    it('updates events', () => {
      const wrapper = shallow(<CalendarContainer {...props} />);
      wrapper.find(SideNav).simulate('refresh');
      expect(EventSource.fetch).to.have.been.calledOnce();
    });
  });
});
