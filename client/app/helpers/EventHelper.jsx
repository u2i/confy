export const SECONDS_IN_DAY = 24 * 60 * 60;

function eventStartsAt(timestamp) {
  return (event) => event.start_timestamp === timestamp;
}

export function eventsStartingAt(timestamp, events) {
  return events.filter(eventStartsAt(timestamp));
}

function eventsAssignedToColumns(eventsGroup) {
  const columns = [];
  eventsGroup.forEach(event => {
    const columnForEvent = columns.find(column => (
      column[column.length - 1].end_timestamp <= event.start_timestamp
    ));
    columnForEvent === undefined ? columns.push([event]) : columnForEvent.push(event);
  });
  return columns;
}

export function setEventsPositionAttributes(events) {
  const groups = buildBlocks(events);
  groups.forEach(group => {
    const columns = eventsAssignedToColumns(group);
    const eventWidth = 1 / columns.length;
    columns.forEach((column, index) => {
      column.forEach(event => {
        event.width = eventWidth;
        event.offset = index;
      })
    });
  });
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
    return this.endTime === null || event.start_timestamp < this.endTime;
  }

  _updateEndTime(event) {
    const eventEndTime = event.end_timestamp;
    if (this._shouldUpdateEndTime(eventEndTime)) {
      this.endTime = eventEndTime;
    }
  }

  _shouldUpdateEndTime(newEndTime) {
    return this.endTime === null || newEndTime > this.endTime;
  }
}

export function sortEventsByStartTime(events) {
  return events.sort((event1, event2) => (
    event1.start_timestamp - event2.start_timestamp
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
