import React from 'react';
import EventSchema from 'schemas/EventSchema';

import icon from './hangouts_icon.png';

const EventHangoutLink = ({ event }) => (
  <div className="event-hangout-link">
    <a href={event.hangout_link}><img src={icon} role="presentation" />&nbsp;Hangouts</a>
  </div>
);

EventHangoutLink.propTypes = {
  event: EventSchema.only('conference_room').isRequired
};

export default EventHangoutLink;
