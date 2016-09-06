import React from 'react';
import instanceOfMoment from 'proptypes/moment';
import { If, Then } from 'react-if';
import { TIME_DISPLAY_FORMAT } from 'helpers/DateHelper';
import moment from 'moment';
import EventSchema from 'proptypes/schemas/EventSchema';

import EventContainer from './EventContainer';
import EventDetails from 'components/calendar/event/details/EventDetails';
import TimeProgress from 'components/shared/time/TimeProgress';

import './current_event.scss';

const CurrentEvent = ({ event, nextEventStart, onCompleted }) => {
  const start = event ? moment(event.start.date_time) : moment();
  const end = event ? moment(event.end.date_time) : nextEventStart;

  return (
    <div className="current-event-container">
      <EventContainer event={event}
                      label="Current Event"
                      noEventLabel="No event is currently in progress">
        {() => <EventDetails event={event} timeFormat={TIME_DISPLAY_FORMAT} showLocation={false} showGuests />}
      </EventContainer>
      <If condition={typeof event !== 'undefined' || typeof nextEventStart !== 'undefined'}>
        <Then>
          {() => (
            <div className="time-progress-container">
              <TimeProgress
                start={start.unix()}
                end={end.unix()}
                onCompleted={onCompleted}
                animate={typeof event !== 'undefined'} />
            </div>
          )}
        </Then>
      </If>
    </div>
  );
};

CurrentEvent.propTypes = {
  event: EventSchema.except('width', 'offset'),
  nextEventStart: instanceOfMoment,
  onCompleted: React.PropTypes.func
};

export default CurrentEvent;
