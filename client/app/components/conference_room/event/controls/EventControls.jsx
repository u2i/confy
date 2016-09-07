import React from 'react';
import { Button } from 'react-bootstrap';
import EventSchema from 'proptypes/schemas/EventSchema';

const InProgressControls = ({ onFinish }) => (
  <div className="event-controls">
    <Button bsStyle="danger" bsSize="large" onClick={onFinish}>Finish</Button>
  </div>
);

InProgressControls.propTypes = {
  onFinish: React.PropTypes.func
};

const UnstartedControls = ({ onConfirm, onCancel }) => (
  <div className="event-controls">
    <Button bsStyle="primary" bsSize="large" onClick={onConfirm}>Confirm</Button>
    <Button bsStyle="danger" bsSize="large" onClick={onCancel}>Cancel</Button>
  </div>
);

UnstartedControls.propTypes = {
  onConfirm: React.PropTypes.func,
  onCancel: React.PropTypes.func
};

const EventControls = ({ event, onConfirm, onCancel, onFinish }) =>
  event.confirmed ?
    <InProgressControls onFinish={onFinish} /> :
    <UnstartedControls onCancel={onCancel} onConfirm={onConfirm} />;

EventControls.proptypes = {
  event: EventSchema.only('confirmed').isRequired,
  onConfirm: React.PropTypes.func,
  onCancel: React.PropTypes.func,
  onFinish: React.PropTypes.func
};

EventControls.InProgressControls = InProgressControls;
EventControls.UnstartedControls = UnstartedControls;

export default EventControls;
