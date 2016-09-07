import React from 'react';
import User from 'test/factories/User';
import Event from 'test/factories/Event';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import EventCreator from 'components/calendar/event/details/EventCreator';

describe('<EventCreator />', () => {
  const defaultEvent = Event.build();
  const defaultWrapper = shallow(<EventCreator event={defaultEvent} />);

  it('renders with .event-creator class', () => {
    expect(defaultWrapper).to.have.className('event-creator');
  });

  context('with creator display name provided', () => {
    const creatorDisplayName = 'creator';
    const event = Event.build({ creator: User.build({ display_name: creatorDisplayName }) });
    const wrapper = shallow(<EventCreator event={event} />);

    it('renders creator display name', () => {
      expect(wrapper).to.have.text(`by ${creatorDisplayName}`);
    });
  });

  context('with no creator display name provided', () => {
    it('renders creator email', () => {
      expect(defaultWrapper).to.have.text(`by ${defaultEvent.creator.email}`);
    });
  });
});
