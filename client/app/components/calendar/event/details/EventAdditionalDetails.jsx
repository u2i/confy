import React from 'react';
import EventAttendees from './EventAttendees';
import EventExpandableDescription from './EventExpandableDescription';
import EventFullDescription from './EventFullDescription';
import EventHangoutLink from './EventHangoutLink';
import EventSchema from 'proptypes/schemas/EventSchema';
import { If, Then, Else } from 'react-if';
import { MAX_DESCRIPTION_LENGTH } from 'helpers/EventHelper';

const EventAdditionalDetails = ({ event }) => (
  <div>
    <If condition={event.description != null}>
      <Then>
        {() => descriptionComponent(event.description)}
      </Then>
    </If>
    <EventAttendees event={event} />
    <EventHangoutLink event={event} />
  </div>
);

const descriptionComponent = (description) => {
  if(description.length > MAX_DESCRIPTION_LENGTH) {
    return <EventExpandableDescription description={description} />;
  }
  return <EventFullDescription description={description} />;
};

EventAdditionalDetails.propTypes = {
  event: EventSchema.only('description', 'attendees').isRequired
};

export default EventAdditionalDetails;
