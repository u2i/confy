import React from 'react';
import { Button } from 'react-bootstrap';

const NoEventControls = ({ onStart }) => (
  <div className="event-controls">
    <Button bsStyle="primary" bsSize="large" disabled onClick={onStart} className="hidden">Start</Button>
  </div>
);

NoEventControls.propTypes = {
  onStart: React.PropTypes.func
};

export default NoEventControls;
