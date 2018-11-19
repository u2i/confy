import sortBy from 'lodash/sortBy';
import moment from 'moment';
import { currentAndNextEvents } from './EventHelper';
import { formatDuration, durationFromNow, ONE_MINUTE } from './DateHelper';

export const AVAILABILITY = {
  ALL_DAY_AVAILABLE: 0,
  CURRENTLY_AVAILABLE: 1,
  CURRENTLY_BUSY: 2
};

function eventsInConferenceRoom(events, conferenceRoomId) {
  return events.filter(event => event.conference_room.id === conferenceRoomId);
}

function allDayAvailableProps(conferenceRoom) {
  return { conferenceRoom, availability: AVAILABILITY.ALL_DAY_AVAILABLE };
}

function currentlyAvailableProps(conferenceRoom, nextEvent) {
  const startTime = moment(nextEvent.start.date_time);
  const duration = durationFromNow(startTime);
  return { conferenceRoom, duration, availability: AVAILABILITY.CURRENTLY_AVAILABLE };
}

function currentlyBusyProps(conferenceRoom, events) {
  const endTime = lastEventEndTime(sortBy(events, 'start_timestamp'));
  const duration = durationFromNow(endTime);
  return { conferenceRoom, duration, availability: AVAILABILITY.CURRENTLY_BUSY };
}

function lastEventEndTime(events) {
  for (let i = 0; i < events.length - 1; i++) {
    if (moment(events[i + 1].start.date_time).diff(moment(events[i].end.date_time)) >= ONE_MINUTE) {
      return moment(events[i].end.date_time);
    }
  }
  return moment(events[events.length - 1].end.date_time);
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
    return right.duration.asMilliseconds() - left.duration.asMilliseconds();
  }
  return left.duration.asMilliseconds() - right.duration.asMilliseconds();
}

function compareWithSameAvailability(left, right) {
  if (left.duration === right.duration) {
    return left.conferenceRoom.title.localeCompare(right.conferenceRoom.title);
  }
  return compareByDuration(left, right);
}

function compareByAvailability(left, right) {
  if (left.availability === right.availability) {
    return compareWithSameAvailability(left, right);
  }
  return left.availability - right.availability;
}

export function sortAvailabilityProps(availabilityProps) {
  availabilityProps.sort((left, right) => compareByAvailability(left, right));
}

export function buildAvailabilityProps(conferenceRooms, events) {
  return conferenceRooms.map(conferenceRoom => roomAvailabilityProps(conferenceRoom, events));
}

export const remainingTime = duration => formatDuration(duration, 'HH:mm');

export const availabilityStatus = (availability, duration) => {
  switch (availability) {
    case AVAILABILITY.ALL_DAY_AVAILABLE:
      return 'available for the whole day';
    case AVAILABILITY.CURRENTLY_AVAILABLE:
      return `available for ${remainingTime(duration)}`;
    case AVAILABILITY.CURRENTLY_BUSY:
      return `available in ${remainingTime(duration)}`;
    default:
      return '';
  }
};

export const availabilityClass = (availability) => {
  switch (availability) {
    case AVAILABILITY.ALL_DAY_AVAILABLE:
      return 'green';
    case AVAILABILITY.CURRENTLY_AVAILABLE:
      return 'yellow';
    case AVAILABILITY.CURRENTLY_BUSY:
      return 'red';
    default:
      return '';
  }
};
