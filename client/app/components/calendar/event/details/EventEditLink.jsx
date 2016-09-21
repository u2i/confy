import React from 'react';
import EventSchema from 'proptypes/schemas/EventSchema';

const EventEditLink = ({ event }) => (
  <div className="event-edit-link">
    <a href={event.html_link} target="_blank" rel="noopener noreferrer">Edit in Google</a>
  </div>
);

EventEditLink.propTypes = {
  event: EventSchema.only('html_link').isRequired
};

export default EventEditLink;
