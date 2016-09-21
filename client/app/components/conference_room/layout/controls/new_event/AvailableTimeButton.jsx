import React from 'react';
import { instanceOfMoment } from 'proptypes/moment';
import { Button } from 'react-bootstrap';

const AvailableTimeButton = ({ onClick }) => (
  <Button bsStyle="primary"
          bsSize="large"
          onClick={() => onClick ? onClick() : null}>
    Until next event
  </Button>
);

AvailableTimeButton.propTypes = {
  onClick: React.PropTypes.func
};

export default AvailableTimeButton;
