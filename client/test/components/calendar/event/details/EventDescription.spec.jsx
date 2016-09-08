import React from 'react';
import Event from 'test/factories/Event';
import { mount } from 'enzyme';
import { expect } from 'chai';

import EventDescription from 'components/calendar/event/details/EventDescription';

describe('<EventDescription />', () => {
  context('when event has description', () => {
    const description = 'very important event';
    const event = Event.build({ description });
    const wrapper = mount(<EventDescription event={event} />);

    it('renders event description', () => {
      expect(wrapper.text()).to.contain(description);
    });
  });

  context('when no description', () => {
    const event = Event.build();
    const wrapper = mount(<EventDescription event={event} />);

    it('does not render label', () => {
      expect(wrapper.text()).to.be.empty();
    });
  });
});
