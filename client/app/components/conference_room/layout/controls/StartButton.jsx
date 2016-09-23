import React from 'react';
import { Button } from 'react-bootstrap';

const StartButton = ({ onClick }) => (
  <div className="event-controls">
    <Button bsStyle="primary" bsSize="large" onClick={onClick}>Start</Button>
  </div>
);

StartButton.propTypes = {
  onClick: React.PropTypes.func
};

export default StartButton;
