import React from 'react';
import EventSchema from 'proptypes/schemas/EventSchema';

import EventContainer from './EventContainer';
import EventDetails from 'components/calendar/event/EventDetails';

const NextEvent = ({ event, noEventLabel }) => (
  <div>
    <EventContainer event={event}
                    label="Next Event"
                    noEventLabel={noEventLabel}>
      {() => <EventDetails event={event} showLocation={false} showGuests />}
    </EventContainer>
  </div>
);

NextEvent.propTypes = {
  event: EventSchema.except('width', 'offset')
};

export default NextEvent;
