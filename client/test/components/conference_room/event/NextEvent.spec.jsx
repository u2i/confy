import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import Event from 'test/factories/Event';

import EventContainer from 'components/conference_room/event/EventContainer';
import EventDetails from 'components/calendar/event/EventDetails';
import NextEvent from 'components/conference_room/event/NextEvent';

describe('<NextEvent />', () => {
  const event = Event.build();
  const defaultWrapper = mount(<NextEvent event={event} />);

  it('renders EventContainer', () => {
    expect(defaultWrapper).to.have.exactly(1).descendants(EventContainer);
  });

  context('event exists', () => {
    it('renders EventDetails', () => {
      expect(defaultWrapper).to.have.exactly(1).descendants(EventDetails);
    });
  });

  context('no event', () => {
    const wrapper = shallow(<NextEvent />);

    it('does not render EventDetails', () => {
      expect(wrapper).not.to.have.descendants(EventDetails);
    })
  })
});
