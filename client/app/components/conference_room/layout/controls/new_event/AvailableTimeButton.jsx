import moment from 'moment';
import React from 'react';
import { instanceOfMoment } from 'proptypes/moment';
import { Button } from 'react-bootstrap';

const timeUntilNextEvent = (nextEventStart) => moment.duration(nextEventStart.diff(moment()));

const AvailableTimeButton = ({ onClick, nextEventStart }) => (
  <Button bsStyle="primary"
          bsSize="large"
          onClick={() => onClick(timeUntilNextEvent(nextEventStart))}>
    Until next event
  </Button>
);

AvailableTimeButton.propTypes = {
  nextEventStart: instanceOfMoment.isRequired
};

export default AvailableTimeButton;
