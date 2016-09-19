import moment from 'moment';
import React from 'react';
import { instanceOfMoment } from 'proptypes/moment';
import { Button } from 'react-bootstrap';
import TimeChoiceButton from './TimeChoiceButton';
import AvailableTimeButton from './AvailableTimeButton';

const DURATIONS = [
  moment.duration(15, 'minutes'),
  moment.duration(30, 'minutes'),
  moment.duration(1, 'hour')
];

const NewEventControls = ({ onCreate, onCancel, nextEventStart }) => (
  <div className="event-controls">
    <AvailableTimeButton nextEventStart={nextEventStart} />
    {DURATIONS.map(duration => (
      <TimeChoiceButton nextEventStart={nextEventStart}
                        duration={duration}
                        onClick={onCreate}
                        key={duration} />
    ))}
    <Button bsSize="large" onClick={onCancel}>Cancel</Button>
  </div>
);

NewEventControls.propTypes = {
  onCreate: React.PropTypes.func,
  onCancel: React.PropTypes.func,
  nextEventStart: instanceOfMoment.isRequired
};

export default NewEventControls;
