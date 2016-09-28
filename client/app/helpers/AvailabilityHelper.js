import { currentAndNextEvents } from './EventHelper';
import { durationFromNow } from './DateHelper';
import sortBy from 'lodash/sortBy';
import moment from 'moment';

export const AVAILABILITY = {
  ALL_DAY_AVAILABLE: 0,
  CURRENTLY_AVAILABLE: 1,
  CURRENTLY_BUSY: 2
};

function eventsInConferenceRoom(events, conferenceRoomId) {
  return events.filter(event => event.conference_room.id === conferenceRoomId);
}

function allDayAvailableProps(conferenceRoom) {
  return { conferenceRoomTitle: conferenceRoom.title, availability: AVAILABILITY.ALL_DAY_AVAILABLE };
}

function currentlyAvailableProps(conferenceRoom, nextEvent) {
  const startTime = moment(nextEvent.start.date_time);
  const duration = durationFromNow(startTime);
  return { conferenceRoomTitle: conferenceRoom.title, duration, availability: AVAILABILITY.CURRENTLY_AVAILABLE };
}

function lastEventEndTime(events) {
  for (let i = 0; i < events.length - 1; i++) {
    if (moment(events[i + 1].start.date_time).diff(moment(events[i].end.date_time)) >= 1000 * 60) {
      return moment(events[i].end.date_time);
    }
  }
  return moment(events[events.length - 1].end.date_time);
}

function currentlyBusyProps(conferenceRoom, events) {
  const endTime = lastEventEndTime(sortBy(events, 'start_timestamp'));
  const duration = durationFromNow(endTime);
  return { conferenceRoomTitle: conferenceRoom.title, duration, availability: AVAILABILITY.CURRENTLY_BUSY };
}

function roomAvailabilityProps(conferenceRoom, allEvents) {
  const events = eventsInConferenceRoom(allEvents, conferenceRoom.id);
  if (events.length === 0) return allDayAvailableProps(conferenceRoom);

  const { current, next } = currentAndNextEvents(events);
  if (current === undefined) return currentlyAvailableProps(conferenceRoom, next[0]);

  return currentlyBusyProps(conferenceRoom, events);
}

function compareByDuration(left, right) {
  if (left.availability === AVAILABILITY.CURRENTLY_AVAILABLE) {
    return left.duration < right.duration;
  }
  return left.duration >= right.duration;
}

function compareWithSameAvailability(left, right) {
  if (left.duration === right.duration) {
    return left.conferenceRoomTitle >= right.conferenceRoomTitle;
  }
  return compareByDuration(left, right);
}

function compareByAvailability(left, right) {
  if (left.availability === right.availability) {
    return compareWithSameAvailability(left, right);
  }
  return left.availability >= right.availability;
}

export function sortByAvailability(props) {
  props.sort((left, right) => compareByAvailability(left, right));
}

export function buildAvailabilityProps(conferenceRooms, events) {
  return conferenceRooms.map(conferenceRoom => roomAvailabilityProps(conferenceRoom, events));
}
