import includes from 'lodash/fp/includes';
import React from 'react';
import { eventTimeString } from 'helpers/DateHelper';
import EventSchema from 'schemas/EventSchema';
import { If } from 'react-if';

import EventTime from './EventTime';
import EventSummary from './EventSummary';
import EventCreator from './EventCreator';
import EventLocation from './EventLocation';
import EventAttendees from './EventAttendees';
import EventDescription from './EventDescription';

import '../event.scss';

const EventDetails = ({ event, timeFormat, fields }) => {
  const time = includes('time')(fields) ? <EventTime event={event} timeFormat={timeFormat} /> : '';
  const summary = includes('summary')(fields) ? <EventSummary event={event} /> : '';
  const creator = includes('creator')(fields) ? <EventCreator event={event} /> : '';
  const location = includes('location')(fields) ? <EventLocation event={event} /> : '';
  const attendees = includes('attendees')(fields) ? <EventAttendees event={event} /> : '';
  const description = includes('description')(fields) ? <EventDescription event={event} /> : '';
  return (
    <div>
      {time}
      {summary}
      {creator}
      {description}
      {location}
      {attendees}
    </div>
  );
};

EventDetails.propTypes = {
  event: EventSchema.except('width', 'offset').isRequired,
  timeFormat: React.PropTypes.string,
  fields: React.PropTypes.arrayOf(React.PropTypes.oneOf([
    'time',
    'summary',
    'description',
    'creator',
    'location',
    'attendees',
    'description'
  ]))
};

EventDetails.defaultProps = {
  fields: ['time', 'summary', 'creator', 'location']
};

export default EventDetails;
