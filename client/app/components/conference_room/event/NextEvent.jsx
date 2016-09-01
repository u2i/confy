import React from 'react';
import EventSchema from 'proptypes/schemas/EventSchema';

import EventContainer from './EventContainer';
import EventDetails from 'components/calendar/event/EventDetails';

const NextEvent = ({ event }) => (
  <div>
    <EventContainer event={event}
                    label="Next Event"
                    noEventLabel="No more events for today">
      {() => <EventDetails event={event} showLocation={false} showGuests={true} />}
    </EventContainer>
  </div>
);

NextEvent.propTypes = {
  event: EventSchema.except('width', 'offset')
};

export default NextEvent;
