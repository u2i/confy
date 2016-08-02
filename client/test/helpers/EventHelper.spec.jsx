import * as EventHelper from '../../app/helpers/EventHelper';
import { expect } from 'chai';
import Event from '../factories/Event';

describe('EventHelper', () => {
  describe('#eventStartsAt()', () => {
    const timestamp = (new Date()).getTime() / 1000;
    const event = Event.build();

    it('returns a function', () => {
      expect(EventHelper.eventStartsAt(timestamp)).to.be.an('function');
    });

    it('returns function that checks if event starts at the specific time', () => {
      const returnedFunction = EventHelper.eventStartsAt(event.start_timestamp);
      expect(returnedFunction(event)).to.eq(true);
    });
  });
  describe('#groupInDay()', () => {
    const event1 = Event.build({}, { start_time: new Date(2016, 7, 25, 4, 0, 0) });
    const event2 = Event.build({}, { start_time: new Date(2016, 7, 25, 12, 0, 0) });
    const event3 = Event.build({}, { start_time: new Date(2016, 7, 26, 4, 0, 0) });
    const event4 = Event.build({}, { start_time: new Date(2016, 7, 26, 12, 0, 0) });
    const timestamp = (new Date(2016, 7, 25, 0, 0, 0)).getTime() / 1000;
    const group1 = [event1, event2];
    const group2 = [event3, event4];
    it('returns true if given group of events sorted by starting time belongs to a specific day', () => {
      expect(EventHelper.groupInDay(group1, timestamp)).to.eq(true);
    });

    it('returns false if given group of events sorted by starting time doest not belong to a specific day', () => {
      expect(EventHelper.groupInDay(group2, timestamp)).to.eq(false);
    });
  });
  describe('#eventGroupContaining()', () => {
    const event1 = Event.build({}, { start_time: new Date(2016, 7, 25, 4, 0, 0) });
    const event2 = Event.build({}, { start_time: new Date(2016, 7, 25, 16, 0, 0) });
    const event3 = Event.build({}, { start_time: new Date(2016, 7, 26, 4, 0, 0) });
    const event4 = Event.build({}, { start_time: new Date(2016, 7, 26, 12, 0, 0) });
    const timestamp = (new Date(2016, 7, 25, 4, 0, 0)).getTime() / 1000;
    const group1 = [event1, event2];
    const group2 = [event3, event4];
    const events = [group1, group2];
    it('returns events group that belongs to specific day and at least one event start at the specific time', () => {
      expect(EventHelper.eventGroupContaining(events, timestamp)).to.eq(group1);
    });
  });

  describe('#eventsStartingAt()', () => {
    const event1 = Event.build({}, { start_time: new Date(2016, 7, 25, 0, 0, 0) });
    const event2 = Event.build({}, { start_time: new Date(2016, 7, 25, 0, 0, 0) });
    const event3 = Event.build({}, { start_time: new Date(2016, 7, 25, 1, 0, 0) });
    const group = [event1, event2, event3];
    const timestamp = (new Date(2016, 7, 25, 0, 0, 0)).getTime() / 1000;
    it('returns events that starts at the specific time', () => {
      expect(EventHelper.eventsStartingAt(timestamp, group)).to.include(event1, event2);
      expect(EventHelper.eventsStartingAt(timestamp, group)).not.to.include(event3);
    });
  });
});
