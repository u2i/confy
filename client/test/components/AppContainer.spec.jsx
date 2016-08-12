import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import shared from 'mocha-shared';
import EventFactory from 'test/factories/Event';
import EventSource from 'sources/EventSource';
import DefaultProps from 'test/factories/DefaultProps';
import * as FiltersHelper from 'helpers/FiltersHelper';
import { Set } from 'immutable';
import AppContainer from 'components/AppContainer';
import SideNav from 'components/layout/SideNav';
import EventDestroyer from 'components/calendar/event/EventDestroyer';

describe('<AppContainer />', () => {
  let props;

  shared.setup('stub ReactDOM.findDOMNode');

  before(() => {
    sinon.stub(EventSource, 'fetch').resolves([]);
    sinon.stub(EventSource, 'remove').resolves([]);
    sinon.stub(FiltersHelper, 'loadFilters').returns(new Set());
    sinon.stub(FiltersHelper, 'saveFilters');
    proxyquire('../../app/sources/EventSource', EventSource);
    proxyquire('../../app/helpers/FiltersHelper', FiltersHelper);
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
      wrapper.find(EventDestroyer).props().onDelete();
      expect(EventSource.remove).to.have.been.calledWith(event.id);
    });
  });
});
