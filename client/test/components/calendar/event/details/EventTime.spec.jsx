import React from 'react';
import Event from 'test/factories/Event';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import EventTime from 'components/calendar/event/details/EventTime';

describe('<EventTime />', () => {
  const event = Event.build();
  const wrapper = shallow(<EventTime event={event} />);

  it('renders event start time', () => {
    expect(wrapper.text()).to.include('0:00');
  });

  it('renders event end time', () => {
    expect(wrapper.text()).to.include('2:00');
  });

  it('renders with .event-time class', () => {
    expect(wrapper).to.have.className('event-time');
  });
});
