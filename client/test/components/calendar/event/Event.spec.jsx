import React from 'react';
import { shallow } from 'enzyme';
import Event from 'components/calendar/event/Event';
import { expect } from 'chai';
import EventFactory from 'test/factories/Event';
import UserFactory from 'test/factories/User';

describe('<Event />', () => {
  const containerHeight = 30;
  const unitEventLengthInSeconds = 30 * 60;
  const timeFormat = 'HH:mm';

  const shallowEvent = (event) => shallow(
    <Event
      event={event}
      containerHeight={containerHeight}
      unitEventLengthInSeconds={unitEventLengthInSeconds}
      timeFormat={timeFormat} />
  );

  const defaultEvent = EventFactory.build();
  const defaultWrapper = shallowEvent(defaultEvent);

  it('renders event start time', () => {
    expect(defaultWrapper.text()).to.include('0:00');
  });

  it('renders event end time', () => {
    expect(defaultWrapper.text()).to.include('2:00');
  });

  it('renders with correct height', () => {
    expect(defaultWrapper).to.have.style('height').equal('120px');
  });

  it('renders with correct background color', () => {
    expect(defaultWrapper).to.have.style('background-color').equal(defaultEvent.conference_room.color);
  });

  context('with event summary provided', () => {
    const summary = 'Summary';
    const event = EventFactory.build({ summary });
    const wrapper = shallowEvent(event);

    it('renders event summary', () => {
      expect(wrapper.text()).to.include(summary);
    });
  });

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

  it('renders event location', () => {
    expect(defaultWrapper.text()).to.include(defaultEvent.conference_room.title);
  });
});
