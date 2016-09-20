import React from 'react';
import { instanceOfMoment } from 'proptypes/moment';
import { Button } from 'react-bootstrap';

const AvailableTimeButton = ({ onClick, nextEventStart }) => (
  <Button bsStyle="primary"
          bsSize="large"
          onClick={() => { if (onClick) onClick(nextEventStart); }}>
    Until next event
  </Button>
);

AvailableTimeButton.propTypes = {
  nextEventStart: instanceOfMoment.isRequired,
  onClick: React.PropTypes.func
};

export default AvailableTimeButton;
