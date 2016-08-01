import React from 'react';
import { shallow } from 'enzyme';
import CalendarRow from '../../app/components/calendar/CalendarRow';
import EventWrapper from '../../app/components/calendar/event/EventWrapper';
import Event from '../factories/Event';
import TimeCell from '../../app/components/calendar/TimeCell';
import { expect } from 'chai';

describe('<CalendarRow />', () => {
  const SECONDS_IN_DAY = 24 * 60 * 60;
  const start1 = new Date();
  const start2 = new Date((new Date()).setHours(start1.getHours() + 4));
  const start3 = new Date();
  start3.setDate(start1.getDate() + 1);
  const start4 = new Date((new Date()).setHours(start3.getHours() + 4));
  const event1 = Event.build({}, { start_time: start1 });
  const event2 = Event.build({}, { start_time: start2 });
  const event3 = Event.build({}, { start_time: start3 });
  const event4 = Event.build({}, { start_time: start4 });
  const group1 = [event1, event2];
  const group2 = [event3, event4];
  const events = [group1, group2];
  const days = [new Date(), new Date(), new Date()];
  const unitEventLengthInSeconds = 1800;
  const time = new Date();
  const props = { events, days, unitEventLengthInSeconds };
  const wrapper1 = shallow(<CalendarRow time={time} {...props} />);
  const wrapperInstance = wrapper1.instance();

  describe('#render()', () => {
    it('renders exactly one <tr />', () => {
      expect(wrapper1.find('tr')).to.have.length(1);
    });

    it('renders exactly one <TimeCell /> inside <tr />', () => {
      expect(wrapper1.find('tr').find(TimeCell)).to.have.length(1);
    });

    it('renders <EventWrapper /> inside <tr /> for each day in days array', () => {
      expect(wrapper1.find('tr').find(EventWrapper)).to.have.length(days.length);
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
      expect(wrapperInstance._eventGroupContaining(event1.start_timestamp)).to.eq(group1);
    });
  });

  describe('#_eventsStartingAt()', () => {
    it('returns events from group that starts at the specified timestamp', () => {
      expect(wrapperInstance._eventsStartingAt(event1.start_timestamp, group1)).to.include(event1);
      expect(wrapperInstance._eventsStartingAt(event1.start_timestamp, group1)).not.to.include(event2);
    });
  });

  describe('#_displayTime()', () => {
    describe('displayMinutes prop is true', () => {
      const wrapper2 = shallow(<CalendarRow displayMinutes time={time} {...props} />);
      it('returns true', () => {
        expect(wrapper2.instance()._displayTime()).to.eq(true);
      });
    });

    describe('displayMinutes prop is false', () => {
      describe('minutes of time prop equals 0', () => {
        const newTime = new Date(time.getTime());
        newTime.setMinutes(0);
        const wrapper3 = shallow(<CalendarRow time={newTime} {...props} />);

        it('returns true', () => {
          expect(wrapper3.instance()._displayTime()).to.eq(true);
        });
      });

      describe('minutes of time prop doest not equal 0', () => {
        const newTime = new Date(time.getTime());
        newTime.setMinutes(1);
        const wrapper4 = shallow(<CalendarRow time={newTime} {...props} />);

        it('returns false', () => {
          expect(wrapper4.instance()._displayTime()).to.eq(false);
        });
      });
    });
  });
});
