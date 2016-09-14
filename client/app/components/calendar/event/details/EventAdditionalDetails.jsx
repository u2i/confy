import React from 'react';
import EventAttendees from './EventAttendees';
import EventDescription from './EventDescription';
import EventHangoutLink from './EventHangoutLink';
import EventSchema from 'proptypes/schemas/EventSchema';
import { If } from 'react-if';

const EventAdditionalDetails = ({ event }) => (
  <div>
    <If condition={event.description != null}>
      <EventDescription event={event} />
    </If>
    <EventAttendees event={event} />
    <EventHangoutLink event={event} />
  </div>
);

EventAdditionalDetails.propTypes = {
  event: EventSchema.only('description', 'attendees').isRequired
};

export default EventAdditionalDetails;
