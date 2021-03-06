import * as EventHelper from '../../app/helpers/EventHelper';
import { expect } from 'chai';
import Event from '../factories/Event';
import ConferenceRoom from '../factories/ConferenceRoom';
import moment from 'moment';

describe('EventHelper', () => {
  describe('#eventsStartingAt()', () => {
    const event1 = Event.build({}, { start_time: new Date(2016, 7, 25, 0, 0, 0) });
    const event2 = Event.build({}, { start_time: new Date(2016, 7, 25, 0, 0, 0) });
    const event3 = Event.build({}, { start_time: new Date(2016, 7, 25, 1, 0, 0) });
    const timestamp = (new Date(2016, 7, 25, 0, 0, 0)).getTime() / 1000;

    const events = [event1, event2, event3];

    it('returns events that starts at the specific time', () => {
      expect(EventHelper.eventsStartingAt(timestamp, events)).to.eql([event1, event2]);
    });
  });

  describe('#buildBlocks()', () => {
    const startTime = moment('2016-01-01T06:00:00');
    const event1 = Event.build({}, {
      start_time: startTime.toDate(),
      end_time: startTime.clone().add(1, 'hours').toDate()
    });

    describe('with mutually colliding events', () => {
      const event2 = Event.build({}, {
        start_time: startTime.clone().add(30, 'minutes').toDate(),
        end_time: startTime.clone().add(2, 'hours').toDate()
      });
      const event3 = Event.build({}, {
        start_time: startTime.clone().add(1, 'hours').toDate(),
        end_time: startTime.clone().add(2, 'hours').toDate()
      });
      const event4 = Event.build({}, {
        start_time: startTime.clone().add(2, 'hours').toDate(),
        end_time: startTime.clone().add(3, 'hours').toDate()
      });
      const event5 = Event.build({}, {
        start_time: startTime.clone().add(3, 'hours').toDate(),
        end_time: startTime.clone().add(5, 'hours').toDate()
      });
      const events = [event1, event2, event3, event4, event5];

      const group1 = [event1, event2, event3];
      const group2 = [event4];
      const group3 = [event5];
      const expectedGroups = [group1, group2, group3];

      it('groups overlapping events', () => {
        expect(EventHelper.buildBlocks(events)).to.eql(expectedGroups);
      });
    });

    describe('with pairwise colliding events', () => {
      const event2 = Event.build({}, {
        start_time: startTime.clone().subtract(1, 'hours').toDate(),
        end_time: startTime.clone().add(2, 'hours').toDate()
      });
      const event3 = Event.build({}, {
        start_time: startTime.clone().add(1, 'hours').toDate(),
        end_time: startTime.clone().add(3, 'hours').toDate()
      });
      const events = [event1, event2, event3];

      const expectedGroups = [event2, event1, event3];

      it('groups overlapping events into one block', () => {
        expect(EventHelper.buildBlocks(events)[0]).to.eql(expectedGroups);
      });
    });

    describe('colliding events separated by another block', () => {
      const event2 = Event.build({}, {
        start_time: startTime.clone().add(2, 'hours').toDate(),
        end_time: startTime.clone().add(3, 'hours').toDate()
      });
      const event3 = Event.build({}, {
        start_time: startTime.clone().toDate(),
        end_time: startTime.clone().add(4, 'hours').toDate()
      });
      const events = [event1, event3, event2];

      const expectedGroup = [event1, event3, event2];

      it('groups overlapping events into one block', () => {
        expect(EventHelper.buildBlocks(events)[0]).to.eql(expectedGroup);
      });
    });
  });

  describe('#setEventsPositionAttributes', () => {
    const startTime = moment('2016-01-01T06:00:00');
    describe('given non colliding events', () => {
      const event1 = Event.build({}, {
        start_time: startTime.toDate(),
        end_time: startTime.clone().add(2, 'hours').toDate()
      });
      const event2 = Event.build({}, {
        start_time: startTime.clone().add(2, 'hours').toDate(),
        end_time: startTime.clone().add(3, 'hours').toDate()
      });
      const event3 = Event.build({}, {
        start_time: startTime.clone().add(4, 'hours').toDate(),
        end_time: startTime.clone().add(5, 'hours').toDate()
      });

      const events = [event1, event2, event3];

      it('sets 100% width for all events and 0 offset', () => {
        EventHelper.setEventsPositionAttributes(events);
        events.forEach(event => {
          expect(event.width).to.eq(1);
          expect(event.offset).to.eq(0);
        });
      });
    });

    describe('given pairwise colliding events', () => {
      const event1 = Event.build({}, {
        start_time: startTime.toDate(),
        end_time: startTime.clone().add(2, 'hours').toDate()
      });
      const event2 = Event.build({}, {
        start_time: startTime.clone().add(1, 'hours').toDate(),
        end_time: startTime.clone().add(3, 'hours').toDate()
      });
      const event3 = Event.build({}, {
        start_time: startTime.clone().add(2, 'hours').toDate(),
        end_time: startTime.clone().add(5, 'hours').toDate()
      });

      const events = [event1, event2, event3];

      it('sets 50% width for all events and event1.offset = event3.offset = 0 and event2.offset = 1', () => {
        EventHelper.setEventsPositionAttributes(events);
        events.forEach(event => expect(event.width).to.eq(0.5));
        expect(event1.offset).to.eq(0);
        expect(event2.offset).to.eq(1);
        expect(event3.offset).to.eq(0);
      });
    });
  });

  describe('#updateRoomEvents', () => {
    const room1 = ConferenceRoom.build();
    const room2 = ConferenceRoom.build();
    const room1Events = Event.buildList(3, { conference_room: room1 });
    const room2Events = Event.buildList(3, { conference_room: room2 });

    const events = room1Events.concat(room2Events);
    const newEvents = Event.buildList(2, { conference_room: room2 });

    const expectedEvents = room1Events.concat(newEvents);

    const updatedEvents = EventHelper.updateRoomEvents(events, newEvents, room2.id);
    it('replaces events for given conference room', () => {
      expect(updatedEvents).to.eql(expectedEvents);
    });

    context('with invalid conference room number', () => {
      expect(() => EventHelper.updateRoomEvents(events, newEvents, 'lol')).to.throw(Error);
    });
  });

  describe('#currentAndNextEvents', () => {
    context('with an ongoing event', () => {
      const events = Event.buildList(1, {}, { start_time: new Date() });

      const { current, next } = EventHelper.currentAndNextEvents(events);

      it('returns it as current event', () => {
        expect(current).to.eql(events[0]);
        expect(next).to.be.empty();
      });
    });

    context('with no ongoing event and a next event', () => {
      const events = Event.buildList(1, {}, { start_time: moment().add(4, 'hours').toDate() });

      const { current, next } = EventHelper.currentAndNextEvents(events);

      it('returns only next event', () => {
        expect(current).not.to.exist();
        expect(next).to.eql(events);
      });
    });

    context('with both ongoing and next events', () => {
      const ongoingEvent = Event.build({}, { start_time: new Date() });
      const nextEvent = Event.build({}, { start_time: moment().add(4, 'hours').toDate() });
      const futureEvent = Event.build({}, { start_time: moment().add(6, 'hours').toDate() });
      const events = [ongoingEvent, nextEvent, futureEvent];

      const { current, next } = EventHelper.currentAndNextEvents(events);

      it('returns both events', () => {
        expect(current).to.equal(ongoingEvent);
        expect(next).to.eql([nextEvent, futureEvent]);
      });
    });
  });
});
