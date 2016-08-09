export const SECONDS_IN_DAY = 24 * 60 * 60;

export function eventsStartingAt(timestamp, events) {
  return events.filter(event => event.start_timestamp === timestamp);
}

function eventsAssignedToColumns(eventsGroup) {
  const columns = [];
  eventsGroup.forEach(event => {
    const columnForEvent = columns.find(column => (
      column[column.length - 1].end_timestamp <= event.start_timestamp
    ));
    columnForEvent ? columnForEvent.push(event) : columns.push([event]);
  });
  return columns;
}

class Block {
  constructor(event = null) {
    this.blockEvents = [];
    this.endTime = null;
    if (event) {
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
    return !this.endTime || event.start_timestamp < this.endTime;
  }

  _updateEndTime(event) {
    const eventEndTime = event.end_timestamp;
    if (this._shouldUpdateEndTime(eventEndTime)) {
      this.endTime = eventEndTime;
    }
  }

  _shouldUpdateEndTime(newEndTime) {
    return !this.endTime || newEndTime > this.endTime;
  }
}

export function sortEventsByStartTime(events) {
  return events.sort((event1, event2) => (
    event1.start_timestamp - event2.start_timestamp
  ));
}

export function buildBlocks(events) {
  const sortedEvents = sortEventsByStartTime(events);
  const blocks = [];
  sortedEvents.forEach(event => {
    const collidingBlock = blocks.find(block => block.canAddEvent(event));
    collidingBlock ? collidingBlock.addEvent(event) : blocks.push(new Block(event));
  });
  return blocks.map(block => block.blockEvents);
}

export function setEventsPositionAttributes(events) {
  if (!events) return;
  const groups = buildBlocks(events);
  groups.forEach(group => {
    const columns = eventsAssignedToColumns(group);
    const eventWidth = 1 / columns.length;
    columns.forEach((column, index) => {
      column.forEach(event => {
        event.width = eventWidth;
        event.offset = index;
      });
    });
  });
}
