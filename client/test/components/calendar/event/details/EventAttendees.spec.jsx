import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Event from 'test/factories/Event';
import User from 'test/factories/User';

import EventAttendees from 'components/calendar/event/details/EventAttendees';

describe('<EventAttendees />', () => {
  const mountWrapper = (event) => mount(<EventAttendees event={event} />);

  const defaultEvent = Event.build({}, { attendees_num: 3 });
  const defaultWrapper = mountWrapper(defaultEvent);

  it('renders with class .event-attendees', () => {
    expect(defaultWrapper).to.have.className('event-attendees');
  });

  context('when attendees exist', () => {
    it('renders Attendees: label', () => {
      expect(defaultWrapper.text()).to.contain('Attendees:');
    });

    it('renders a list', () => {
      expect(defaultWrapper).to.have.exactly(1).descendants('ul');
    });

    it('renders a list item for every attendee', () => {
      expect(defaultWrapper.find('li')).to.have.lengthOf(3);
    });

    context('when attendee display name is available', () => {
      const attendee = User.build(1, { display_name: 'bob' });
      const event = Event.build();
      event.attendees.push(attendee);
      const wrapper = mountWrapper(event);

      it('renders display name', () => {
        expect(wrapper.find('li')).to.have.text(attendee.display_name);
      });
    });

    context('when no attendee display name', () => {
      const attendee = User.build();
      const event = Event.build();
      event.attendees.push(attendee);
      const wrapper = mountWrapper(event);

      it('renders email', () => {
        expect(wrapper.find('li')).to.have.text(attendee.email);
      });
    });

    context('when logged in user is in attendee list', () => {
      it('does not render a list item for current user', () => {
        expect(defaultWrapper).to.have.exactly(3).descendants('li');
      });
    });
  });

  context('when no attendees except for conference room', () => {
    const event = Event.build();
    const wrapper = mountWrapper(event);

    it('does not render Attendees: label', () => {
      expect(wrapper.text()).not.to.contain('Attendees:');
    });
  });
});
