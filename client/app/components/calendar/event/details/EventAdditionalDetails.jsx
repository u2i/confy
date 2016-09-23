import React from 'react';
import EventAttendees from './EventAttendees';
import EventExpandableDescription from './EventExpandableDescription';
import EventFullDescription from './EventFullDescription';
import EventHangoutLink from './EventHangoutLink';
import EventSchema from 'proptypes/schemas/EventSchema';
import { If, Then } from 'react-if';
import { MAX_DESCRIPTION_LENGTH } from 'helpers/EventHelper';
import EventDestroyer from '../EventDestroyer';

const descriptionComponent = (description) => {
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return <EventExpandableDescription description={description} />;
  }
  return <EventFullDescription description={description} />;
};

const userIsCreator = (event) => {
  const creator = event.creator || { self: false };
  return creator.self;
};

const EventAdditionalDetails = ({ event, onDelete }) => (
  <div>
    <If condition={userIsCreator(event) === true}>
      <EventDestroyer onDelete={onDelete} event={event} />
    </If>
    <If condition={event.description != null}>
      <Then>
        {() => descriptionComponent(event.description)}
      </Then>
    </If>
    <EventAttendees event={event} />
    <EventHangoutLink event={event} />
  </div>
);

EventAdditionalDetails.propTypes = {
  event: EventSchema.only('description', 'attendees').isRequired,
  onDelete: React.PropTypes.func
};

export default EventAdditionalDetails;
