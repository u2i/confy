import React from 'react';
import EventSchema from 'schemas/EventSchema';

import icon from './hangouts_icon.png';

const linkRegex = /.*\/(.*?)(\?.*)?$/;

const extractHangoutName = (link) => {
  const match = link.match(linkRegex);
  return match ? match[1] : 'Hangouts';
};

const EventHangoutLink = ({ event }) => (
  <div className="event-hangout-link">
    <a href={event.hangout_link} target="_blank" rel="noopener noreferrer">
      <img src={icon} role="presentation" />&nbsp;{extractHangoutName(event.hangout_link || '')}
    </a>
  </div>
);

EventHangoutLink.propTypes = {
  event: EventSchema.only('conference_room').isRequired
};

export default EventHangoutLink;
