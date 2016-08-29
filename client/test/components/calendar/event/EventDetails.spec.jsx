import React from 'react';
import EventDetails from 'components/calendar/event/EventDetails';
import EventFactory from 'test/factories/Event';
import UserFactory from 'test/factories/User';
import { shallow } from 'enzyme';
import { expect } from 'chai';

describe('<EventDetails />', () => {
  const shallowEvent = (event) => shallow(
    <EventDetails event={event}
                  creator={event.creator} />
  );

  const defaultEvent = EventFactory.build();
  const defaultWrapper = shallowEvent(defaultEvent);

  it('renders event start time', () => {
    expect(defaultWrapper.text()).to.include('0:00');
  });

  it('renders event end time', () => {
    expect(defaultWrapper.text()).to.include('2:00');
  });

  it('renders event location', () => {
    expect(defaultWrapper.text()).to.include(defaultEvent.conference_room.title);
  });

  context('with event summary provided', () => {
    const summary = 'Summary';
    const event = EventFactory.build({ summary });
    const wrapper = shallowEvent(event);

    it('renders event summary', () => {
      expect(wrapper.text()).to.include(summary);
    });
  });

  describe('display name', () => {
    context('with creator display name provided', () => {
      const creatorDisplayName = 'creator';
      const event = EventFactory.build({ creator: UserFactory.build({ display_name: creatorDisplayName }) });
      const wrapper = shallowEvent(event);

      it('renders creator display name', () => {
        expect(wrapper.text()).to.include(creatorDisplayName);
      });
    });

    context('with no creator display name provided', () => {
      it('renders creator email', () => {
        expect(defaultWrapper.text()).to.include(defaultEvent.creator.email);
      });
    });
  });
});
