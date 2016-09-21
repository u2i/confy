import React from 'react';
import instanceOfMoment from 'proptypes/moment';
import requiredIf from 'react-required-if';
import { TIME_DISPLAY_FORMAT } from 'helpers/DateHelper';
import moment from 'moment';
import EventSchema from 'proptypes/schemas/EventSchema';
import Controls from '../layout/controls/Controls';
import TimeProgress from 'components/shared/time/TimeProgress';
import EventTime from 'components/calendar/event/details/EventTime';
import EventCreator from 'components/calendar/event/details/EventCreator';
import EventAttendees from 'components/calendar/event/details/EventAttendees';
import EventFullDescription from 'components/calendar/event/details/EventFullDescription';
import { If } from 'react-if';
import './current_event.scss';

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

const CurrentEvent = ({ event, nextEventStart, onCompleted, onConfirm, onFinish, onCancel }) => (
  <div className="current-event-container event-container">
    {event ? <Event event={event} /> : <NoEvent />}
    {event || nextEventStart ? <TimeProgressContainer event={event}
                                                      nextEventStart={nextEventStart}
                                                      onCompleted={onCompleted} /> : ''}
    <Controls event={event} onConfirm={onConfirm} onFinish={onFinish} onCancel={onCancel} />
  </div>
);

CurrentEvent.propTypes = {
  event: EventSchema.except('width', 'offset'),
  nextEventStart: instanceOfMoment,
  onCompleted: React.PropTypes.func,
  onConfirm: React.PropTypes.func,
  onFinish: React.PropTypes.func
};

CurrentEvent.Event = Event;
CurrentEvent.NoEvent = NoEvent;
CurrentEvent.TimeProgressContainer = TimeProgressContainer;

export default CurrentEvent;
