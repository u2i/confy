import React from 'react';
import { shallow } from 'enzyme';
import CalendarRow from '../../app/components/calendar/CalendarRow';
import EventWrapper from '../../app/components/calendar/event/EventWrapper';
import TimeCell from '../../app/components/calendar/TimeCell';
import { expect } from 'chai';

describe('<CalendarRow />', () => {
  const SECONDS_IN_DAY = 24 * 60 * 60;
  const start1 = new Date();
  const start1TimestampInSeconds = start1.getTime() / 1000;
  const start2 = new Date((new Date()).setHours(start1.getHours() + 4));
  const start2TimestampInSeconds = start2.getTime() / 1000;
  const start3 = new Date();
  start3.setDate(start1.getDate() + 1);
  const start3TimestampInSeconds = start3.getTime() / 1000;
  const start4 = new Date((new Date()).setHours(start3.getHours() + 4));
  const start4TimestampInSeconds = start4.getTime() / 1000;
  const event1 = {
    start:           { date_time: start1 },
    start_timestamp: start1TimestampInSeconds
  };
  const event2 = {
    start:           { date_time: start2 },
    start_timestamp: start2TimestampInSeconds
  };
  const event3 = {
    start:           { date_time: start3 },
    start_timestamp: start3TimestampInSeconds
  };
  const event4 = {
    start:           { date_time: start4 },
    start_timestamp: start4TimestampInSeconds
  };
  const group1 = [event1, event2];
  const group2 = [event3, event4];
  const events = [group1, group2];
  const days = [new Date(), new Date(), new Date()];
  const unitEventLengthInSeconds = 1800;
  const time = new Date();
  const props = { events, days, unitEventLengthInSeconds };
  let wrapper = shallow(<CalendarRow time={time} {...props} />);
  const wrapperInstance = wrapper.instance();

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
    const beginningOfDay = new Date(start1.getTime());
    beginningOfDay.setSeconds(0);
    beginningOfDay.setMinutes(0);
    beginningOfDay.setHours(0);
    const beginningOfDayTimestamp = beginningOfDay.getTime() / 1000;

    it('checks if events group belongs to a specific day', () => {
      expect(wrapperInstance._groupInDay(events[0], beginningOfDayTimestamp)).to.eq(true);
      const timestampDayBefore = beginningOfDayTimestamp - SECONDS_IN_DAY;
      expect(wrapperInstance._groupInDay(events[0], timestampDayBefore)).to.eq(false);
    });
  });

  describe('#_eventGroupContaining()', () => {
    it('returns events group for specific timestamp', () => {
      expect(wrapperInstance._eventGroupContaining(start1TimestampInSeconds)).to.eq(group1);
    });
  });

  describe('#_eventsStartingAt()', () => {
    it('returns events from group that starts at the specified timestamp', () => {
      expect(wrapperInstance._eventsStartingAt(start1TimestampInSeconds, group1)).to.include(event1);
      expect(wrapperInstance._eventsStartingAt(start1TimestampInSeconds, group1)).not.to.include(event2);
    });
  });

  describe('#_displayTime()', () => {
    describe('displayMinutes prop is true', () => {
      let wrapper = shallow(<CalendarRow displayMinutes time={time} {...props} />);
      it('returns true', () => {
        expect(wrapper.instance()._displayTime()).to.eq(true);
      });
    });

    describe('displayMinutes prop is false', () => {
      describe('minutes of time prop equals 0', () => {
        const newTime = new Date(time.getTime());
        newTime.setMinutes(0);
        const wrapper = shallow(<CalendarRow time={newTime} {...props} />);

        it('returns true', () => {
          expect(wrapper.instance()._displayTime()).to.eq(true);
        });
      });

      describe('minutes of time prop doest not equal 0', () => {
        const newTime = new Date(time.getTime());
        newTime.setMinutes(1);
        const wrapper = shallow(<CalendarRow time={newTime} {...props} />);

        it('returns false', () => {
          expect(wrapper.instance()._displayTime()).to.eq(false);
        });
      });
    });
  });
});
