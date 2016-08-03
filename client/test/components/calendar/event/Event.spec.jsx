import React from 'react';
import { shallow, mount } from 'enzyme';
import Event from 'components/calendar/event/Event';
import DeleteButton from 'components/calendar/event/DeleteButton';
import { expect } from 'chai';
import EventFactory from 'test/factories/Event';

describe('<Event />', () => {
  const containerHeight = 30;
  const unitEventLengthInSeconds = 30 * 60;
  const timeFormat = 'HH:mm';
  it('renders correctly', () => {
    const event = EventFactory.build({ summary: 'Summary' });
    const wrapper = shallow(
      <Event
        event={event}
        containerHeight={containerHeight}
        unitEventLengthInSeconds={unitEventLengthInSeconds}
        timeFormat={timeFormat}
        onDelete={(_id) => {}} />
    );
    expect(wrapper.find('div')).to.have.lengthOf(5);
    const eventStyle = wrapper.find('.event').props().style;
    expect(eventStyle.height).to.eq(120);
    expect(eventStyle.backgroundColor).to.eq(event.conference_room.color);
    expect(wrapper.find('.event-time').text()).to.include('0:00');
    expect(wrapper.find('.event-name').text()).to.include(event.summary);
    expect(wrapper.find('.event-user').text()).to.include(event.creator.display_name);
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
        onDelete={(_id) => {}} />
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
        onDelete={(_id) => {}} />
    );
    expect(wrapper.find('.event-user').text()).to.include(event.creator.email);
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
          onDelete={(_id) => {}} />
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
          onDelete={(id) => {}} />
      );
      expect(wrapper.find(DeleteButton)).to.have.lengthOf(0);
    });
  });
});
