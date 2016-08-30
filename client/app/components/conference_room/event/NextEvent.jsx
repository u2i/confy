import React from 'react';
import EventSchema from 'proptypes/schemas/EventSchema';

import EventContainer from './EventContainer';
import EventDetails from 'components/calendar/event/EventDetails';

const NextEvent = ({ event }) => (
  <EventContainer event={event}
                  label="Next Event"
                  noEventLabel="No more events for today">
    <EventDetails event={event} showLocation={false} />
  </EventContainer>
);

NextEvent.propTypes = {
  event: EventSchema
};

export default NextEvent;
