import React from 'react';
import EventSchema from 'schemas/EventSchema';

const EventSummary = ({ event }) => (
  <div className="event-summary">{event.summary}</div>
);

EventSummary.propTypes = {
  event: EventSchema.only('summary').isRequired
};

export default EventSummary;
