import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import EventFactory from 'test/factories/Event';
import UserFactory from 'test/factories/User';

import Event from 'components/calendar/event/Event';
import DeleteButton from 'components/calendar/event/DeleteButton';

describe('<Event />', () => {
  const containerHeight = 30;
  const unitEventLengthInSeconds = 30 * 60;
  const timeFormat = 'HH:mm';
  const onDelete = sinon.spy();

  it('renders correctly', () => {
    const event = EventFactory.build({ summary: 'Summary' });
    const wrapper = shallow(
      <Event
        event={event}
        containerHeight={containerHeight}
        unitEventLengthInSeconds={unitEventLengthInSeconds}
        timeFormat={timeFormat}
        onDelete={onDelete} />
    );
    expect(wrapper.find('div')).to.have.lengthOf(5);
    const eventStyle = wrapper.find('.event').props().style;
    expect(eventStyle.height).to.eq(120);
    expect(eventStyle.backgroundColor).to.eq(event.conference_room.color);
    expect(wrapper.find('.event-time').text()).to.include('0:00');
    expect(wrapper.find('.event-name').text()).to.include(event.summary);
    expect(wrapper.find('.event-user').text()).to.include(event.creator.email);
    expect(wrapper.find('.event-location').text()).to.include(event.conference_room.title);
  });

  it('renders correctly with other length', () => {
    const event = EventFactory.build();
    event.end_timestamp += 60 * 60; // 1 hour
    const wrapper = shallow(
      <Event
        event={event}
        containerHeight={containerHeight}
        unitEventLengthInSeconds={unitEventLengthInSeconds}
        timeFormat={timeFormat}
        onDelete={onDelete} />
    );
    expect(wrapper.find('.event').props().style.height).to.eq(180);
  });

  it('renders email when no display_name', () => {
    const event = EventFactory.build();
    event.creator.display_name = undefined;
    const wrapper = shallow(
      <Event
        event={event}
        containerHeight={containerHeight}
        unitEventLengthInSeconds={unitEventLengthInSeconds}
        timeFormat={timeFormat}
        onDelete={onDelete}/>
    );
    expect(wrapper.find('.event-user').text()).to.include(event.creator.email);
  });

  const shallowEvent = (event) => shallow(
    <Event
      event={event}
      containerHeight={containerHeight}
      unitEventLengthInSeconds={unitEventLengthInSeconds}
      timeFormat={timeFormat}
      onDelete={onDelete} />
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

  describe('creator.self', () => {
    it('renders delete button when self correctly', () => {
      let event = EventFactory.build();
      event.creator.self = true;
      const wrapper = mount(
        <Event
          event={event}
          containerHeight={containerHeight}
          unitEventLengthInSeconds={unitEventLengthInSeconds}
          timeFormat={timeFormat}
          onDelete={onDelete} />
      );
      expect(wrapper.find(DeleteButton)).to.have.lengthOf(1);
    });
  });

  describe('undefined creator.self', () => {
    it('does not render delete button when not self', () => {
      let event = EventFactory.build();
      event.creator.self = undefined;
      const wrapper = mount(
        <Event
          event={event}
          containerHeight={containerHeight}
          unitEventLengthInSeconds={unitEventLengthInSeconds}
          timeFormat={timeFormat}
          onDelete={onDelete} />
      );
      expect(wrapper.find(DeleteButton)).to.have.lengthOf(0);
    });
  });
});
