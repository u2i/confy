import React from 'react';
import { Grid, Col, Jumbotron, ProgressBar } from 'react-bootstrap';
import { DATE_DISPLAY_FORMAT } from 'helpers/DateHelper';
import moment from 'moment';

import EventContainer from './EventContainer';
import EventDetails from 'components/calendar/event/EventDetails';
import TimeProgress from '../time/TimeProgress';

import './current_event.scss';

export default ({ event, progress }) => (
  <div className="current-event-container">
    <EventContainer event={event}
                    label="Current Event"
                    noEventLabel="No event is currently in progress">
      {() => (
        <div>
          <EventDetails event={event} timeFormat={DATE_DISPLAY_FORMAT} showLocation={false} />
          <div className="time-progress-container">
            <TimeProgress start={moment(event.start.date_time).unix()} end={moment(event.end.date_time).unix()}/>
          </div>
        </div>
      )}
    </EventContainer>
  </div>
);
