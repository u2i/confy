import includes from 'lodash/fp/includes';
import React from 'react';
import EventSchema from 'schemas/EventSchema';

import EventTime from './EventTime';
import EventSummary from './EventSummary';
import EventCreator from './EventCreator';
import EventLocation from './EventLocation';

import '../event.scss';

const EventDetails = ({ event, timeFormat }) => (
  <div>
    <EventTime event={event} timeFormat={timeFormat} />
    <EventSummary event={event} />
    <EventCreator event={event} />
    <EventLocation event={event} />
  </div>
);

EventDetails.propTypes = {
  event: EventSchema.except('width', 'offset').isRequired,
  timeFormat: React.PropTypes.string
};

export default EventDetails;
