import React from 'react';
import instanceOfMoment from 'proptypes/moment';
import { If, Then, Else } from 'react-if';
import { TIME_DISPLAY_FORMAT } from 'helpers/DateHelper';
import moment from 'moment';
import EventSchema from 'proptypes/schemas/EventSchema';

import EventDetails from 'components/calendar/event/details/EventDetails';
import TimeProgress from 'components/shared/time/TimeProgress';

import './current_event.scss';

const CurrentEvent = ({ event, nextEventStart, onCompleted }) => (
  <div className="current-event-container event-container">
    <If condition={typeof event !== 'undefined'}>
      <Then>{() => (
        <div>
          <h2 className="event-summary">{event.summary}</h2>
          <EventDetails event={event}
                        timeFormat={TIME_DISPLAY_FORMAT}
                        fields={['time', 'creator', 'attendees', 'description']} />
        </div>
      )}</Then>
      <Else><p>No event currently in progress</p></Else>
    </If>
    <If condition={typeof event !== 'undefined' || typeof nextEventStart !== 'undefined'}>
      <div className="text-center">
        <Then>{() => (
          <TimeProgress
            end={event ? moment(event.end.date_time) : nextEventStart}
            suffix={event ? 'left' : 'to next event'}
            onCompleted={onCompleted} />
        )}</Then>
      </div>
    </If>
  </div>
);

CurrentEvent.propTypes = {
  event: EventSchema.except('width', 'offset'),
  nextEventStart: instanceOfMoment,
  onCompleted: React.PropTypes.func
};

export default CurrentEvent;
