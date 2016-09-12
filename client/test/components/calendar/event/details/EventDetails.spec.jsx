import React from 'react';
import EventDetails from 'components/calendar/event/details/EventDetails';
import EventFactory from 'test/factories/Event';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import EventTime from 'components/calendar/event/details/EventTime';
import EventSummary from 'components/calendar/event/details/EventSummary';
import EventCreator from 'components/calendar/event/details/EventCreator';
import EventLocation from 'components/calendar/event/details/EventLocation';

describe('<EventDetails />', () => {
  const shallowEvent = (event) => shallow(
    <EventDetails event={event} />
  );

  const defaultEvent = EventFactory.build();
  const defaultWrapper = shallowEvent(defaultEvent);

  it('renders time, summary, creator and location', () => {
    expect(defaultWrapper).to.have.exactly(1).descendants(EventTime);
    expect(defaultWrapper).to.have.exactly(1).descendants(EventSummary);
    expect(defaultWrapper).to.have.exactly(1).descendants(EventCreator);
    expect(defaultWrapper).to.have.exactly(1).descendants(EventLocation);
  });
});
