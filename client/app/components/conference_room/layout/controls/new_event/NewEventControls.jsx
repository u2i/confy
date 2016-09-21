import moment from 'moment';
import React from 'react';
import { If } from 'react-if';
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
    {DURATIONS.map(duration => (
      <TimeChoiceButton nextEventStart={nextEventStart}
                        duration={duration}
                        onClick={onCreate}
                        key={duration} />
    ))}
    <If condition={typeof nextEventStart !== 'undefined'}>
      <AvailableTimeButton onClick={() => onCreate(nextEventStart)} />
    </If>
    <Button bsSize="large" onClick={onCancel}>Cancel</Button>
  </div>
);

NewEventControls.propTypes = {
  onCreate: React.PropTypes.func,
  onCancel: React.PropTypes.func,
  nextEventStart: instanceOfMoment
};

export default NewEventControls;
