import includes from 'lodash/fp/includes';
import React from 'react';
import { eventTimeString } from 'helpers/DateHelper';
import EventSchema from 'schemas/EventSchema';
import { If } from 'react-if';

import EventAttendees from './EventAttendees';

import './event.scss';

const defaultCreator = { display_name: 'private', self: false };
const creator = (event) => event.creator || defaultCreator;

const EventDetails = ({ event, timeFormat, fields }) => (
  <div>
    <If condition={includes('time')(fields)}>
      <div className="event-time">{eventTimeString(event, timeFormat)}</div>
    </If>
    <If condition={includes('summary')(fields)}>
      <div className="event-name">{includes('summary')(fields) && event.summary}</div>
    </If>
    <If condition={includes('creator')(fields)}>
      <div className="event-user">
        <small>by&nbsp;</small>
        {creator(event).display_name || creator(event).email}
      </div>
    </If>
    <If condition={includes('location')(fields)}>
      <div className="event-location">
        <small>in&nbsp;</small>
        {event.conference_room.title}
      </div>
    </If>
    <If condition={includes('attendees')(fields)}>
      <EventAttendees attendees={event.attendees} />
    </If>
  </div>
);

EventDetails.propTypes = {
  event: EventSchema.except('width', 'offset').isRequired,
  timeFormat: React.PropTypes.string,
  fields: React.PropTypes.arrayOf(React.PropTypes.oneOf([
    'time',
    'summary',
    'description',
    'creator',
    'location',
    'attendees'
  ]))
};

EventDetails.defaultProps = {
  fields: ['time', 'summary', 'creator', 'location']
};

export default EventDetails;
