import React from 'react';
import { Set } from 'immutable';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import shared from 'mocha-shared';
import EventSource from 'sources/EventSource';
import Event from 'test/factories/Event';
import User from 'test/factories/User';
import DefaultProps from 'test/factories/DefaultProps';
import * as FiltersHelper from 'helpers/FiltersHelper';

import App from 'components/App';
import SideNav from 'components/layout/SideNav';
import EventDestroyer from 'components/calendar/event/EventDestroyer';

describe('<App />', () => {
  let props;

  shared.setup('stub ReactDOM.findDOMNode');

  before(() => {
    sinon.stub(EventSource, 'fetch').resolves([]);
    sinon.stub(EventSource, 'remove').resolves([]);
    sinon.stub(FiltersHelper, 'loadFilters').returns(new Set());
    sinon.stub(FiltersHelper, 'saveFilters');
    proxyquire('../../app/sources/EventSource', EventSource);
  });

  beforeEach(() => {
    props = DefaultProps.build();
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
    mount(<App {...props} />);
    expect(EventSource.fetch).to.have.been.called();
  });

  describe('refresh', () => {
    it('updates events', () => {
      const wrapper = shallow(<App {...props} />);
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
      const event = Event.build({ creator: User.build({ self: true }) });
      const wrapper = mount(<App {...props} initialEvents={[event]} />);
      wrapper.find('.delete-button').simulate('click');

      wrapper.find(EventDestroyer).props().onDelete();
      expect(EventSource.remove).to.have.been.calledOnce();
      expect(EventSource.remove).to.have.been.calledWith(event.id);
    });
  });
});
