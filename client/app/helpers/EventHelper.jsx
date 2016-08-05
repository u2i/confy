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

class Block {
  constructor(event = null) {
    this.blockEvents = [];
    this.endTime = null;
    if (event !== null) {
      this.addEvent(event);
    }
  }

  addEvent(event) {
    if (this.canAddEvent(event)) {
      this.blockEvents.push(event);
      this._updateEndTime(event);
    }
  }

  canAddEvent(event) {
    return this.endTime === null || event.start.date_time < this.endTime;
  }

  _updateEndTime(event) {
    const eventEndTime = event.end.date_time;
    if (this._shouldUpdateEndTime(eventEndTime)) {
      this.endTime = eventEndTime;
    }
  }

  _shouldUpdateEndTime(newEndTime) {
    return this.endTime === null || newEndTime > this.endTime;
  }
}

function sortEventsByStartTime(events) {
  return events.sort((event1, event2) => (
    new Date(event1.start.date_time).getTime() - new Date(event2.start.date_time).getTime()
  ));
}

export function buildBlocks(events) {
  if (events === undefined) return events;
  const sortedEvents = sortEventsByStartTime(events);
  const blocks = [];
  sortedEvents.forEach(event => {
    const collidingBlock = blocks.find(block => block.canAddEvent(event));
    collidingBlock === undefined ? blocks.push(new Block(event)) : collidingBlock.addEvent(event);
  });
  return blocks.map(block => block.blockEvents);
}
