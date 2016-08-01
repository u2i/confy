import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import Event from '../../../factories/Event';

import EventWrapper from '../../../../app/components/calendar/event/EventWrapper';
import EventGroup from '../../../../app/components/calendar/event/EventGroup';

describe('<EventWrapper />', () => {
  const event = Event.build();
  const events = [event];
  const eventProps = {
    eventsInGroup:            1,
    offset:                   0,
    timestamp:                new Date().getTime(),
    unitEventLengthInSeconds: 60
  };

  const spy = sinon.spy(EventWrapper.prototype, 'setState');

  let wrapper;
  beforeEach(() => {
    wrapper = mount(<EventWrapper {...eventProps} />);
  });

  afterEach(() => {
    spy.reset();
  });

  it('renders <EventGroup /> when event prop is not empty', () => {
    wrapper.setProps({ events });
    expect(wrapper.find(EventGroup)).to.have.lengthOf(1);
  });

  it('should not render <EventGroup /> when not passed in events', () => {
    expect(wrapper.find(EventGroup)).to.have.lengthOf(0);
  });

  it('should not render <EventGroup /> when passed in empty event array', () => {
    wrapper.setProps({ events: [] });
    expect(wrapper.find(EventGroup)).to.have.lengthOf(0);
  });

  it('sets width and height', () => {
    wrapper.setProps({ events });
    wrapper.unmount();
    wrapper.mount();

    expect(spy).to.have.been.called();
    expect(spy.getCall(0).args[0]).to.include.all.keys('width', 'height');
  });

  it('updates on window resize', () => {
    window.dispatchEvent(new window.Event('resize'));

    expect(spy).to.have.been.called();
    expect(spy.getCall(0).args[0]).to.include.all.keys('width', 'height');
  });
});
