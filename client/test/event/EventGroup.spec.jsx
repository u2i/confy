import React from 'react';
import { shallow } from 'enzyme';
import EventGroup from '../../app/components/calendar/event/EventGroup';
import { expect } from 'chai';
import { _ } from 'lodash';

describe('<EventGroup />', () => {
  const eventSummary = 'Sample Event';
  const creator = { email: 'creator@example.com', self: true };
  const sampleRoom = {
    id: 8,
    capacity: 10,
    title: 'Narnia One',
    color: '#dffabd',
    email: 'email@resource.calendar.google.com'
  };
  const sampleEvent = {
    attendees: [{ response_status: 'needsAction', self: true }],
    creator,
    end: { date_time: '2016-07-25T02:30:00.000+02:00' },
    id: '7utc9k4fds8kf2734q72dsoq8c',
    start: { date_time: '2016-07-25T00:30:00.000+02:00' },
    conference_room: sampleRoom,
    start_timestamp: 1469397600,
    end_timestamp: 1469406600,
    summary: eventSummary
  };
  const containerHeight = 30;
  const containerWidth = 120;
  const unitEventLengthInSeconds = 30 * 60;
  const timeFormat = 'HH:mm';

  it('renders correctly', () => {
    const wrapper = shallow(
      <EventGroup
        events={[sampleEvent]}
        containerHeight={containerHeight}
        containerWidth={containerWidth}
        unitEventLengthInSeconds={unitEventLengthInSeconds}
        timestamp={sampleEvent.start_timestamp}
        offset = {0}
        eventsInGroup={2} />
    );
    expect(wrapper.find(".event-group").length).to.equal(1);
    expect(wrapper.find(".event-group").props().style.marginLeft).to.equal(0);
    expect(wrapper.find(".event-group").props().style.width).to.equal(60);
    expect(wrapper.find("Event").length).to.equal(1);
  });

  it('renders multiple events', () => {
    let eventClone = _.cloneDeep(sampleEvent);
    eventClone.id += "1";
    const wrapper = shallow(
      <EventGroup
        events={[sampleEvent, eventClone]}
        containerHeight={containerHeight}
        containerWidth={containerWidth}
        unitEventLengthInSeconds={unitEventLengthInSeconds}
        timestamp={sampleEvent.start_timestamp}
        offset = {0}
        eventsInGroup={3} />
    );
    expect(wrapper.find(".event-group").props().style.width).to.equal(80);
    expect(wrapper.find("Event").length).to.equal(2);
  });

  it('sets correct offset', () => {
    const wrapper = shallow(
      <EventGroup
        events={[sampleEvent]}
        containerHeight={containerHeight}
        containerWidth={containerWidth}
        unitEventLengthInSeconds={unitEventLengthInSeconds}
        timestamp={sampleEvent.start_timestamp}
        offset = {2}
        eventsInGroup={2} />
    );
    expect(wrapper.find(".event-group").props().style.marginLeft).to.equal(120);
  });
});
