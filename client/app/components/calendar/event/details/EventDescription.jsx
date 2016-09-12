import React from 'react';
import { If } from 'react-if';
import EventSchema from 'proptypes/schemas/EventSchema';

const EventDescription = ({ event }) => (
  <div className="event-description">
    <If condition={typeof event.description !== 'undefined'}>
      <div>
        <small>Description:&nbsp;</small>
        <p>{event.description}</p>
      </div>
    </If>
  </div>
);

EventDescription.propTypes = {
  event: EventSchema.only('description').isRequired
};

export default EventDescription;
