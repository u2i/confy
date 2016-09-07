import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import Event from 'test/factories/Event';

import EventDetails from 'components/calendar/event/details/EventDetails';
import NextEvent from 'components/conference_room/event/NextEvents';

describe('<NextEvents />', () => {
  const event = Event.build();
  const defaultWrapper = mount(<NextEvent events={[event]} />);

  context('event exists', () => {
    it('renders EventDetails', () => {
      expect(defaultWrapper).to.have.exactly(1).descendants(EventDetails);
    });
  });

  context('no events', () => {
    const wrapper = shallow(<NextEvent events={[]} />);

    it('does not render EventDetails', () => {
      expect(wrapper).not.to.have.descendants(EventDetails);
    });
  });
});
