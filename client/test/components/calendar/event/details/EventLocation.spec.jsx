import React from 'react';
import Event from 'test/factories/Event';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import EventLocation from 'components/calendar/event/details/EventLocation';

describe('<EventLocation />', () => {
  const event = Event.build();
  const wrapper = shallow(<EventLocation event={event} />);

  it('renders event location', () => {
    expect(wrapper).to.have.text(`in ${event.conference_room.title}`);
  });

  it('renders with .event-location class', () => {
    expect(wrapper).to.have.className('event-location');
  });
});
