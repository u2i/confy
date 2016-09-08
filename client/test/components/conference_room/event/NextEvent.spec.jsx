import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import Event from 'test/factories/Event';

import NextEvent from 'components/conference_room/event/NextEvents';
import EventSummary from 'components/calendar/event/details/EventSummary';
import EventTime from 'components/calendar/event/details/EventTime';
import EventCreator from 'components/calendar/event/details/EventCreator';

describe('<NextEvents />', () => {
  const event = Event.build();
  const defaultWrapper = mount(<NextEvent events={[event]} />);

  context('event exists', () => {
    it('renders detauils of event', () => {
      expect(defaultWrapper).to.have.exactly(1).descendants(EventTime);
      expect(defaultWrapper).to.have.exactly(1).descendants(EventSummary);
      expect(defaultWrapper).to.have.exactly(1).descendants(EventCreator);
    });
  });

  context('no events', () => {
    const wrapper = shallow(<NextEvent events={[]} />);

    it('does not render EventDetails', () => {
      expect(wrapper).not.to.have.descendants(EventTime);
      expect(wrapper).not.to.have.descendants(EventSummary);
      expect(wrapper).not.to.have.descendants(EventCreator);
    });
  });
});
