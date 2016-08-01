import React from 'react';
import {shallow, mount} from 'enzyme';
import Event from '../../app/components/calendar/event/Event';
import DeleteButton from '../../app/components/calendar/event/DeleteButton';
import {expect} from 'chai';
import EventFactory from '../factories/Event'

describe('<Event />', () => {
  const containerHeight = 30;
  const unitEventLengthInSeconds = 30 * 60;
  const timeFormat = 'HH:mm';
  describe('creator.self', () => {
    it('renders delete button when self correctly', () => {
      let event = EventFactory.build();
      event.creator.self = true;
      const wrapper = mount(
        <Event
          event={event}
          containerHeight={containerHeight}
          unitEventLengthInSeconds={unitEventLengthInSeconds}
          timeFormat={timeFormat}/>
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
          timeFormat={timeFormat}/>
      );
      expect(wrapper.find(DeleteButton)).to.have.lengthOf(0);
    });
  });
});