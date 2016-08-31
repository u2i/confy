import React from 'react';
import { If } from 'react-if';
import { DATE_DISPLAY_FORMAT } from 'helpers/DateHelper';
import moment from 'moment';
import EventSchema from 'proptypes/schemas/EventSchema';

import EventContainer from './EventContainer';
import EventDetails from 'components/calendar/event/EventDetails';
import TimeProgress from '../time/TimeProgress';

import './current_event.scss';

const CurrentEvent = ({ event, nextEventStart, onCompleted }) => {
  const start = (event ? moment(event.start.date_time) : moment()).unix();
  const end = (event ? moment(event.end.date_time) : moment(nextEventStart)).unix();

  return (
    <div className="current-event-container">
      <EventContainer event={event}
                      label="Current Event"
                      noEventLabel="No event is currently in progress">
        {() => (
          <EventDetails event={event} timeFormat={DATE_DISPLAY_FORMAT} showLocation={false}/>
        )}
      </EventContainer>
      <If condition={typeof event !== 'undefined' || typeof nextEventStart !== 'undefined'}>
        <div className="time-progress-container">
          <TimeProgress
            start={start}
            end={end}
            onCompleted={onCompleted}/>
        </div>
      </If>
    </div>
  );
};

CurrentEvent.propTypes = {
  event: EventSchema.except('width', 'offset'),
  nextEventStart: React.PropTypes.string,
  onCompleted: React.PropTypes.func
};

export default CurrentEvent;
