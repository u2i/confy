import React from 'react';
import { eventTimeString } from 'helpers/DateHelper';
import EventSchema from 'schemas/EventSchema';

import './event.scss';

const EventDetails = ({ event, timeFormat }) => (
  <div>
    <div className="event-time">{eventTimeString(event, timeFormat)}</div>
    <div className="event-name">{event.summary}</div>
    <div className="event-user">
      <small>by&nbsp;</small>
      {event.creator.display_name || event.creator.email}
    </div>
    <div className="event-location">
      <small>in&nbsp;</small>
      {event.conference_room.title}
    </div>
  </div>
);

EventDetails.propTypes = {
  event: EventSchema.isRequired,
  timeFormat: React.PropTypes.string
};

export default EventDetails;
