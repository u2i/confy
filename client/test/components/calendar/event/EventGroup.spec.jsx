import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import EventFactory from 'test/factories/Event';

import EventGroup from 'components/calendar/event/EventGroup';

describe('<EventGroup />', () => {
  const containerHeight = 30;
  const containerWidth = 120;
  const unitEventLengthInSeconds = 30 * 60;
  const onDelete = sinon.spy();
  

  it('renders correctly', () => {
    const event = EventFactory.build();
    const wrapper = shallow(
      <EventGroup
        events={[event]}
        containerHeight={containerHeight}
        containerWidth={containerWidth}
        unitEventLengthInSeconds={unitEventLengthInSeconds}
        timestamp={event.start_timestamp}
        offset={0}
        eventsInGroup={2}
        onDelete={onDelete} />
    );
    expect(wrapper.find('.event-group')).to.have.lengthOf(1);
    expect(wrapper.find('.event-group').props().style.marginLeft).to.equal(0);
    expect(wrapper.find('.event-group').props().style.width).to.equal(60);
    expect(wrapper.find('Event').length).to.equal(1);
  });

  it('renders multiple events', () => {
    const events = [EventFactory.build(), EventFactory.build()];
    const wrapper = shallow(
      <EventGroup
        events={events}
        containerHeight={containerHeight}
        containerWidth={containerWidth}
        unitEventLengthInSeconds={unitEventLengthInSeconds}
        timestamp={events[0].start_timestamp}
        offset={0}
        eventsInGroup={3}
        onDelete={onDelete} />
    );
    expect(wrapper.find('.event-group').props().style.width).to.equal(80);
    expect(wrapper.find('Event')).to.have.lengthOf(2);
  });

  it('sets correct offset', () => {
    const event = EventFactory.build();
    const wrapper = shallow(
      <EventGroup
        events={[event]}
        containerHeight={containerHeight}
        containerWidth={containerWidth}
        unitEventLengthInSeconds={unitEventLengthInSeconds}
        timestamp={event.start_timestamp}
        offset={2}
        eventsInGroup={2}
        onDelete={onDelete} />
    );
    expect(wrapper.find('.event-group').props().style.marginLeft).to.equal(120);
  });
});
