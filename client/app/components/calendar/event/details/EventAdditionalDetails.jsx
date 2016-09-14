import React from 'react';
import EventAttendees from './EventAttendees';
import EventDescription from './EventDescription';
import EventSchema from 'proptypes/schemas/EventSchema';

const EventAdditionalDetails = ({ event }) => (
  <div>
    <EventDescription event={event} />
    <EventAttendees event={event} />
  </div>
);

EventAdditionalDetails.propTypes = {
  event: EventSchema.only('description', 'attendees').isRequired
};

export default EventAdditionalDetails;
