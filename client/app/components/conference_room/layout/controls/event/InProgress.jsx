import React from 'react';
import { Button } from 'react-bootstrap';

const InProgress = ({ onFinish }) => (
  <div className="event-controls">
    <h3>Confirmed!</h3>
    <Button bsStyle="danger" bsSize="large" onClick={onFinish}>Finish</Button>
  </div>
);

InProgress.propTypes = {
  onFinish: React.PropTypes.func
};

export default InProgress;
