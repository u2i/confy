export const SECONDS_IN_DAY = 24 * 60 * 60;

export function eventStartsAt(timestamp) {
  return (event) => event.start_timestamp === timestamp;
}

export function groupInDay(group, timestamp) {
  const lastEvent = group[group.length - 1];
  return Math.abs(lastEvent.start_timestamp - timestamp) < SECONDS_IN_DAY;
}

export function eventGroupContaining(events, timestamp) {
  return events.find(group =>
    group.length &&
    groupInDay(group, timestamp) &&
    group.some(eventStartsAt(timestamp))
  );
}

export function eventsStartingAt(timestamp, group) {
  return group.filter(eventStartsAt(timestamp));
}