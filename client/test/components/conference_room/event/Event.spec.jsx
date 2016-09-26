import React from 'react';
import Event from 'components/conference_room/event/Event';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import EventFactory from 'test/factories/Event';
import EventTime from 'components/calendar/event/details/EventTime';
import EventCreator from 'components/calendar/event/details/EventCreator';
import EventAttendees from 'components/calendar/event/details/EventAttendees';
import EventFullDescription from 'components/calendar/event/details/EventFullDescription';

describe('<Event />', () => {
  const summary = 'Summary';
  const event = EventFactory.build({ summary });

  const wrapper = shallow(<Event event={event} />);

  it('renders event summary', () => {
    expect(wrapper.text()).to.contain(summary);
  });

  it('renders <EventDetails /> with time, creator, attendees and description', () => {
    expect(wrapper).to.have.exactly(1).descendants(EventTime);
    expect(wrapper).to.have.exactly(1).descendants(EventCreator);
    expect(wrapper).to.have.exactly(1).descendants(EventAttendees);
    expect(wrapper).to.have.exactly(1).descendants(EventFullDescription);
  });
});
