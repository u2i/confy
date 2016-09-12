import React from 'react';
import { eventTimeString } from 'helpers/DateHelper';
import EventSchema from 'schemas/EventSchema';

const EventTime = ({ event, timeFormat }) => (
  <div className="event-time">{eventTimeString(event, timeFormat)}</div>
);

EventTime.propTypes = {
  event: EventSchema.only('start', 'end').isRequired,
  timeFormat: React.PropTypes.string
};

export default EventTime;
