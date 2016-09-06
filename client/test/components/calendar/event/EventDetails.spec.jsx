import React from 'react';
import EventDetails from 'components/calendar/event/EventDetails';
import EventFactory from 'test/factories/Event';
import UserFactory from 'test/factories/User';
import { mount } from 'enzyme';
import { expect } from 'chai';

import EventAttendees from 'components/calendar/event/EventAttendees';

describe('<EventDetails />', () => {
  const mountEvent = (event) => mount(
    <EventDetails event={event}
                  creator={event.creator} />
  );

  const defaultEvent = EventFactory.build();
  const defaultWrapper = mountEvent(defaultEvent);

  context('with time in fields', () => {
    it('renders event start time', () => {
      expect(defaultWrapper.text()).to.include('0:00');
    });

    it('renders event end time', () => {
      expect(defaultWrapper.text()).to.include('2:00');
    });
  });

  context('with summary in fields', () => {
    context('with event summary provided', () => {
      const summary = 'Summary';
      const event = EventFactory.build({ summary });
      const wrapper = mountEvent(event);

      it('renders event summary', () => {
        expect(wrapper.text()).to.include(summary);
      });
    });
  });

  context('with creator in fields', () => {
    context('with creator display name provided', () => {
      const creatorDisplayName = 'creator';
      const event = EventFactory.build({ creator: UserFactory.build({ display_name: creatorDisplayName }) });
      const wrapper = mountEvent(event);

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

  context('with location in fields', () => {
    it('renders event location', () => {
      expect(defaultWrapper.text()).to.contain(defaultEvent.conference_room.title);
    });
  });

  context('with empty fields prop', () => {
    const wrapper = mount(<EventDetails event={defaultEvent} fields={[]} />);

    it('renders nothing', () => {
      expect(wrapper).not.to.have.descendants('.event-time');
      expect(wrapper).not.to.have.descendants('.event-name');
      expect(wrapper).not.to.have.descendants('.event-user');
      expect(wrapper).not.to.have.descendants('.event-location');
      expect(wrapper).not.to.have.descendants('.event-attendees');
    });
  });

  context('with no fields prop', () => {
    it('renders time, summary, creator and location', () => {
      expect(defaultWrapper).to.have.exactly(1).descendants('.event-time');
      expect(defaultWrapper).to.have.exactly(1).descendants('.event-name');
      expect(defaultWrapper).to.have.exactly(1).descendants('.event-user');
      expect(defaultWrapper).to.have.exactly(1).descendants('.event-location');
    });
  });

  context('with attendees in fields', () => {
    const wrapper = mount(<EventDetails event={defaultEvent} fields={['attendees']} />);

    it('renders <EventAttendees />', () => {
      expect(wrapper).to.have.exactly(1).descendants(EventAttendees);
    });
  });

});
