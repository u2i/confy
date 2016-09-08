import React from 'react';
import { Button } from 'react-bootstrap';

const InProgress = ({ onFinish }) => (
  <div className="event-controls">
    <Button bsStyle="danger" bsSize="large" onClick={onFinish} disabled>Finish</Button>
  </div>
);

InProgress.propTypes = {
  onFinish: React.PropTypes.func
};

export default InProgress;
