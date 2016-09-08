import React from 'react';
import EventSchema from 'schemas/EventSchema';

const EventLocation = ({ event }) => (
  <div className="event-location">
    <small>in&nbsp;</small>
    {event.conference_room.title}
  </div>
);

EventLocation.propTypes = {
  event: EventSchema.only('conference_room').isRequired
};

export default EventLocation;
