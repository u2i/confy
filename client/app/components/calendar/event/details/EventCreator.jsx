import React from 'react';
import EventSchema from 'schemas/EventSchema';

const defaultCreator = { display_name: 'private', self: false };
const creator = (event) => event.creator || defaultCreator;

const EventCreator = ({ event }) => (
  <div className="event-creator">
    <small>by&nbsp;</small>
    {creator(event).display_name || creator(event).email}
  </div>
);

EventCreator.propTypes = {
  event: EventSchema.only('creator').isRequired
};

export default EventCreator;
