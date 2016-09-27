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

const eventTimeControls = ({ onCreate, nextEventStart, currentEventEnd }) => {
  const buttons = DURATIONS.map(duration => (
    <TimeChoiceButton start={currentEventEnd}
                      duration={duration}
                      onClick={onCreate}
                      key={duration} />
  ));

  if (nextEventStart) {
    buttons.push(<AvailableTimeButton onClick={() => onCreate(nextEventStart)} key={nextEventStart} />);
  }
  return buttons;
};

export default eventTimeControls;
