import React from 'react';
import EventSchema from 'proptypes/schemas/EventSchema';
import { TIME_DISPLAY_FORMAT } from 'helpers/DateHelper';
import EventTime from 'components/calendar/event/details/EventTime';
import EventCreator from 'components/calendar/event/details/EventCreator';
import EventAttendees from 'components/calendar/event/details/EventAttendees';
import { If } from 'react-if';
import EventFullDescription from 'components/calendar/event/details/EventFullDescription';

const Event = ({ event }) => (
  <div>
    <h2 className="event-summary">{event.summary}</h2>
    <EventTime event={event} timeFormat={TIME_DISPLAY_FORMAT} />
    <EventCreator event={event} />
    <EventAttendees event={event} />
    <If condition={event.description != null}>
      <EventFullDescription description={event.description} />
    </If>
  </div>
);

Event.propTypes = {
  event: EventSchema.only('summary').isRequired
};

export default Event;
