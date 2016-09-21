import React from 'react';
import { Button } from 'react-bootstrap';

const Unstarted = ({ onConfirm, onCancel }) => (
  <div className="event-controls">
    <Button bsStyle="primary" bsSize="large" onClick={onConfirm}>Confirm</Button>
    <Button bsStyle="danger" bsSize="large" onClick={onCancel}>Cancel</Button>
  </div>
);

Unstarted.propTypes = {
  onConfirm: React.PropTypes.func,
  onCancel: React.PropTypes.func
};

export default Unstarted;
