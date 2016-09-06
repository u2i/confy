import React from 'react';
import EventDetails from 'components/calendar/event/details/EventDetails';
import EventFactory from 'test/factories/Event';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import EventTime from 'components/calendar/event/details/EventTime';
import EventSummary from 'components/calendar/event/details/EventSummary';
import EventCreator from 'components/calendar/event/details/EventCreator';
import EventLocation from 'components/calendar/event/details/EventLocation';
import EventAttendees from 'components/calendar/event/details/EventAttendees';
import EventDescription from 'components/calendar/event/details/EventDescription';

describe('<EventDetails />', () => {
  const shallowEvent = (event) => shallow(
    <EventDetails event={event}
                  creator={event.creator} />
  );

  const defaultEvent = EventFactory.build();
  const defaultWrapper = shallowEvent(defaultEvent);

  context('with time in fields', () => {
    it('renders <EventTime />', () => {
      expect(defaultWrapper).to.have.exactly(1).descendants(EventTime);
    });
  });

  context('with summary in fields', () => {
    it('renders <EventSummary />', () => {
      expect(defaultWrapper).to.have.exactly(1).descendants(EventSummary);
    });
  });

  context('with creator in fields', () => {
    it('renders <EventCreator />', () => {
      expect(defaultWrapper).to.have.exactly(1).descendants(EventCreator);
    });
  });

  context('with location in fields', () => {
    it('renders <EventLocation />', () => {
      expect(defaultWrapper).to.have.exactly(1).descendants(EventLocation);
    });
  });

  context('with empty fields prop', () => {
    const wrapper = shallow(<EventDetails event={defaultEvent} fields={[]} />);

    it('renders nothing', () => {
      expect(wrapper).not.to.have.descendants(EventTime);
      expect(wrapper).not.to.have.descendants(EventCreator);
      expect(wrapper).not.to.have.descendants(EventDescription);
      expect(wrapper).not.to.have.descendants(EventLocation);
      expect(wrapper).not.to.have.descendants(EventAttendees);
      expect(wrapper).not.to.have.descendants(EventSummary);
    });
  });

  context('with no fields prop', () => {
    it('renders time, summary, creator and location', () => {
      expect(defaultWrapper).to.have.exactly(1).descendants(EventTime);
      expect(defaultWrapper).to.have.exactly(1).descendants(EventSummary);
      expect(defaultWrapper).to.have.exactly(1).descendants(EventCreator);
      expect(defaultWrapper).to.have.exactly(1).descendants(EventLocation);
    });
  });

  context('with attendees in fields', () => {
    const wrapper = shallow(<EventDetails event={defaultEvent} fields={['attendees']} />);

    it('renders <EventAttendees />', () => {
      expect(wrapper).to.have.exactly(1).descendants(EventAttendees);
    });
  });

  context('with description in fields', () => {
    const wrapper = shallow(<EventDetails event={defaultEvent} fields={['description']} />);

    it('renders <EventDescription />', () => {
      expect(wrapper).to.have.exactly(1).descendants(EventDescription);
    });
  });
});
