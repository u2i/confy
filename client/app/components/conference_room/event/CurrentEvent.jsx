import React from 'react';
import instanceOfMoment from 'proptypes/moment';
import requiredIf from 'react-required-if';
import { If, Then, Else } from 'react-if';
import { TIME_DISPLAY_FORMAT } from 'helpers/DateHelper';
import moment from 'moment';
import EventSchema from 'proptypes/schemas/EventSchema';

import EventDetails from 'components/calendar/event/details/EventDetails';
import TimeProgress from 'components/shared/time/TimeProgress';

import './current_event.scss';

const Event = ({ event }) => (
  <div>
    <h2 className="event-summary">{event.summary}</h2>
    <EventDetails event={event}
                  timeFormat={TIME_DISPLAY_FORMAT}
                  fields={['time', 'creator', 'attendees', 'description']} />
  </div>
);

Event.propTypes = {
  event: EventSchema.only('summary').isRequired
};

const NoEvent = () => <p>No event currently in progress</p>;

const TimeProgressContainer = ({ event, nextEventStart, onCompleted }) => (
  <div className="text-center">
      <TimeProgress
        end={event ? moment(event.end.date_time) : nextEventStart}
        suffix={event ? 'left' : 'to next event'}
        onCompleted={onCompleted} />
  </div>
);

TimeProgressContainer.propTypes = {
  event: requiredIf(EventSchema.only('end'), props => !props.nextEventStart),
  nextEventStart: requiredIf(instanceOfMoment, props => !props.event),
  onCompleted: React.PropTypes.func
};

const CurrentEvent = ({ event, nextEventStart, onCompleted }) => (
  <div className="current-event-container event-container">
    {event ? <Event event={event} /> : <NoEvent />}
    {event || nextEventStart ? <TimeProgressContainer event={event}
                                                      nextEventStart={nextEventStart}
                                                      onCompleted={onCompleted}/> : ''}
  </div>
);

CurrentEvent.propTypes = {
  event: EventSchema.except('width', 'offset'),
  nextEventStart: instanceOfMoment,
  onCompleted: React.PropTypes.func
};

CurrentEvent.Event = Event;
CurrentEvent.NoEvent = NoEvent;
CurrentEvent.TimeProgressContainer = TimeProgressContainer;

export default CurrentEvent;
