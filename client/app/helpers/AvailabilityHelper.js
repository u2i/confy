import { currentAndNextEvents } from 'helpers/EventHelper';
import { durationFromNow } from 'helpers/DateHelper';
import sortBy from 'lodash/sortBy';
import moment from 'moment';

export const AVAILABILITY = {
  ALL_DAY_AVAILABLE: 0,
  CURRENTLY_AVAILABLE: 1,
  BUSY: 2
};

export function roomAvailabilityProps(conferenceRoom, allEvents) {
  const events = eventsInConferenceRoom(allEvents, conferenceRoom.id);
  if(events.length === 0) return noEventsTodayProps(conferenceRoom);

  const { current, next } = currentAndNextEvents(events);
  if(current === undefined) return timeTillNextEventProps(conferenceRoom, next[0]);

  return occupiedTimeProps(conferenceRoom, events);
}

function eventsInConferenceRoom(events, conferenceRoomId) {
  return events.filter(event => event.conference_room.id === conferenceRoomId);
}

function noEventsTodayProps(conferenceRoom) {
  return { conferenceRoomTitle: conferenceRoom.title, availability: AVAILABILITY.ALL_DAY_AVAILABLE };
}

function timeTillNextEventProps(conferenceRoom, nextEvent) {
  const startTime = moment(nextEvent.start.date_time);
  const duration = durationFromNow(startTime);
  return { conferenceRoomTitle: conferenceRoom.title, duration, availability: AVAILABILITY.CURRENTLY_AVAILABLE };
}

function occupiedTimeProps(conferenceRoom, events) {
  const endTime = lastEventEndTime(sortBy(events, 'start_timestamp'));
  const duration = durationFromNow(endTime);
  return { conferenceRoomTitle: conferenceRoom.title, duration, availability: AVAILABILITY.BUSY };
}

function lastEventEndTime(events) {
  for (var i = 0; i < events.length - 1; i++) {
    if (moment(events[i+1].start.date_time).diff(moment(events[i].end.date_time)) >= 1000 * 60) {
      return moment(events[i].end.date_time);
    }
  }
  return moment(events[events.length - 1].end.date_time);
}

export function sortByAvailability(props) {
  props.sort((a, b) => {
    return compareByAvailability(a, b);
  });
}

function compareByAvailability(a, b) {
  if (a.availability === b.availability) {
    if (a.availability === AVAILABILITY.CURRENTLY_AVAILABLE) {
      return a.duration <= b.duration;
    }
    if (a.availability === AVAILABILITY.BUSY) {
      return a.duration >= b.duration;
    }
  }
  return a.availability >= b.availability;
}

export function buildAvailabilityProps(conferenceRooms, events) {
  return conferenceRooms.map(conferenceRoom => {
    return roomAvailabilityProps(conferenceRoom, events);
  });
}
