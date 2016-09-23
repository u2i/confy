import React from 'react';
import EventSchema from 'proptypes/schemas/EventSchema';
import EventEditLink from 'components/calendar/event/details/EventEditLink';

const SuccessMessage = ({ event }) => (
  <div>
    <p>Event created!</p>
    <EventEditLink event={event} />
  </div>
);

SuccessMessage.propTypes = {
  event: EventSchema.only('html_link').isRequired
};

export default SuccessMessage;
