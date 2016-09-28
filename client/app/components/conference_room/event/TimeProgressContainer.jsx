import React from 'react';
import moment from 'moment';
import { instanceOfMoment } from 'proptypes/moment';
import requiredIf from 'react-required-if';
import EventSchema from 'proptypes/schemas/EventSchema';
import TimeProgress from 'components/shared/time/TimeProgress';

const TimeProgressContainer = ({ event, nextEventStart, onCompleted, displayEndTimeWarning }) => (
  <div className="text-center">
    <TimeProgress
      end={event ? moment(event.end.date_time) : nextEventStart}
      suffix={event ? 'left' : 'to next event'}
      displayEndTimeWarning={displayEndTimeWarning}
      onCompleted={onCompleted} />
  </div>
);

TimeProgressContainer.propTypes = {
  event: requiredIf(EventSchema.only('end'), props => !props.nextEventStart),
  nextEventStart: requiredIf(instanceOfMoment, props => !props.event),
  onCompleted: React.PropTypes.func,
  displayEndTimeWarning: React.PropTypes.func
};

export default TimeProgressContainer;
