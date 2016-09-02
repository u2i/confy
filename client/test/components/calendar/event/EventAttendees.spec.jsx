import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import User from 'test/factories/User';

import EventAttendees from 'components/calendar/event/EventAttendees';

describe('<EventAttendees />', () => {
  const shallowWrapper = (...attendees) => shallow(<EventAttendees attendees={attendees} />);

  const defaultAttendees = User.buildList(3);
  const defaultWrapper = shallowWrapper(...defaultAttendees);

  it('renders with class .event-attendees', () => {
    expect(defaultWrapper).to.have.className('event-attendees');
  });

  it('renders attendees: label', () => {
    expect(defaultWrapper.text()).to.contain('attendees:');
  });

  it('renders a list', () => {
    expect(defaultWrapper).to.have.exactly(1).descendants('ul');
  });

  it('renders a list item for every attendee', () => {
    expect(defaultWrapper.find('li')).to.have.lengthOf(3);
  });

  context('when attendee display name is available', () => {
    const attendee = User.build({ display_name: 'bob' });
    const wrapper = shallowWrapper(attendee);

    it('renders display name', () => {
      expect(wrapper.find('li')).to.have.text(attendee.display_name);
    });
  });

  context('when no attendee display name', () => {
    const attendee = User.build();
    const wrapper = shallowWrapper(attendee);

    it('renders email', () => {
      expect(wrapper.find('li')).to.have.text(attendee.email);
    });
  });

  context('when logged in user is in attendee list', () => {
    const attendee = User.build({ self: true });
    const wrapper = shallowWrapper(attendee);

    it('does not render a list item for current user', () => {
      expect(wrapper).to.not.have.descendants('li');
    });
  });
});
