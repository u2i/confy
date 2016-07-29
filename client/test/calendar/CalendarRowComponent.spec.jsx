import React from 'react';
import { shallow } from 'enzyme';
import CalendarRow from '../../app/components/calendar/CalendarRow';
import EventWrapper from '../../app/components/calendar/event/EventWrapper';
import TimeCell from '../../app/components/calendar/TimeCell';
import { expect } from 'chai';

describe('<CalendarRow />', () => {
  const SECONDS_IN_DAY = 24 * 60 * 60;
  const start1 = new Date();
  const start1_timestamp_in_seconds = start1.getTime() / 1000;
  const start2 = new Date((new Date()).setHours(start1.getHours() + 4));
  const start2_timestamp_in_seconds = start2.getTime() / 1000;
  const start3 = new Date();
  start3.setDate(start1.getDate() + 1);
  const start3_timestamp_in_seconds = start3.getTime() / 1000;
  const start4 = new Date((new Date()).setHours(start3.getHours() + 4));
  const start4_timestamp_in_seconds = start4.getTime() / 1000;
  const event1 = {
    start:           { date_time: start1 },
    start_timestamp: start1_timestamp_in_seconds
  };
  const event2 = {
    start:           { date_time: start2 },
    start_timestamp: start2_timestamp_in_seconds
  };
  const event3 = {
    start:           { date_time: start3 },
    start_timestamp: start3_timestamp_in_seconds
  };
  const event4 = {
    start:           { date_time: start4 },
    start_timestamp: start4_timestamp_in_seconds
  };
  const group1 = [event1, event2];
  const group2 = [event3, event4];
  const events = [group1, group2];
  const days = [new Date(), new Date(), new Date()];
  const unitEventLengthInSeconds = 1800;
  const time = new Date();
  const props = { events, days, unitEventLengthInSeconds };
  const wrapper = shallow(<CalendarRow time={time} {...props} />);
  const wrapper_instance = wrapper.instance();

  describe('#render()', () => {
    it('renders exactly one <tr />', () => {
      expect(wrapper.find('tr')).to.have.length(1);
    });

    it('renders exactly one <TimeCell /> inside <tr />', () => {
      expect(wrapper.find('tr').find(TimeCell)).to.have.length(1);
    });

    it('renders <EventWrapper /> inside <tr /> for each day in days array', () => {
      expect(wrapper.find('tr').find(EventWrapper)).to.have.length(days.length);
    });
  });

  describe('#_groupInDay()', () => {
    let beginningOfDay = new Date(start1.getTime());
    beginningOfDay.setSeconds(0);
    beginningOfDay.setMinutes(0);
    beginningOfDay.setHours(0);
    const beginningOfDayTimestamp = beginningOfDay.getTime() / 1000;

    it('checks if events group belongs to a specific day', () => {
      expect(wrapper_instance._groupInDay(events[0], beginningOfDayTimestamp)).to.eq(true);
      const timestamp_day_before = beginningOfDayTimestamp - SECONDS_IN_DAY;
      expect(wrapper_instance._groupInDay(events[0], timestamp_day_before)).to.eq(false);
    });
  });

  describe('#_eventGroupContaining()', () => {
    it('returns events group for specific timestamp', () => {
      expect(wrapper_instance._eventGroupContaining(start1_timestamp_in_seconds)).to.eq(group1);
    });
  });

  describe('#_eventsStartingAt()', () => {
    it('returns events from group that starts at the specified timestamp', () => {
      expect(wrapper_instance._eventsStartingAt(start1_timestamp_in_seconds, group1)).to.include(event1);
      expect(wrapper_instance._eventsStartingAt(start1_timestamp_in_seconds, group1)).not.to.include(event2);
    });
  });

  describe('#_displayTime()', () => {
    describe('displayMinutes prop is true', () =>{
      const wrapper = shallow(<CalendarRow time={time} displayMinutes={true} {...props} />);
      it('returns true', () => {
        expect(wrapper.instance()._displayTime()).to.eq(true);
      });
    });

    describe('displayMinutes prop is false', () => {
      describe('minutes of time prop equals 0', () => {
        const new_time = new Date(time.getTime());
        new_time.setMinutes(0);
        const wrapper = shallow(<CalendarRow time={new_time} displayMinutes={false} {...props} />);

        it('returns true', () => {
          expect(wrapper.instance()._displayTime()).to.eq(true);
        });
      });

      describe('minutes of time prop doest not equal 0', () => {
        const new_time = new Date(time.getTime());
        new_time.setMinutes(1);
        const wrapper = shallow(<CalendarRow time={new_time} displayMinutes={false} {...props} />);

        it('returns false', () => {
          expect(wrapper.instance()._displayTime()).to.eq(false);
        });
      });
    });
  });
});