import moment from 'moment';
import sortBy from 'lodash/sortBy';
import { humanize } from './StringHelper';

export const currentAndNextEvents = (events) => {
  events = sortBy(events, 'start_timestamp');
  const currentEventIndex = events.findIndex((event) => moment(event.start.date_time).isSameOrBefore(moment()));
  const current = events[currentEventIndex];
  const next = currentEventIndex > -1 ? events.slice(currentEventIndex + 1) : events;
  return { current, next };
}

export const nextEventStart = (events) => {
  const nextEvent = events[0];
  const startTime = nextEvent ? nextEvent.start.date_time : undefined;
  return startTime ? moment(startTime) : undefined;
};

export const eventTimeString = (event) => {
  const startTimeStr = formatTime(event.start.date_time);
  const endTimeStr = formatTime(event.end.date_time);
  return `${startTimeStr} - ${endTimeStr}`;
}

export const eventCreator = (event) => {
  const defaultCreator = { display_name: 'private' };
  const creator = event.creator || defaultCreator;
  return creator.display_name || humanize(creator.email);
}

export const formatDate = (date, format = 'ddd M/D') => {
  if (moment.isMoment(date)) {
    return date.format(format);
  }
  return moment(date).format(format);
}

export const formatTime = (time, format = 'H:mm') => {
  return formatDate(time, format);
}
