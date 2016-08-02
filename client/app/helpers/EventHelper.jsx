export const SECONDS_IN_DAY = 24 * 60 * 60;

function eventStartsAt(timestamp) {
  return (event) => event.start_timestamp === timestamp;
}

export function eventGroupContaining(events, timestamp) {
  return events.find(group =>
    group.some(eventStartsAt(timestamp))
  );
}

export function eventsStartingAt(timestamp, group) {
  return group.filter(eventStartsAt(timestamp));
}
