import React from 'react';
import { Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import EventSchema from 'proptypes/schemas/EventSchema';

const InProgressControls = ({ onFinish }) => (
  <Button bsStyle="danger" onClick={onFinish}>Finish</Button>
);

InProgressControls.propTypes = {
  onFinish: React.PropTypes.func
};

const UnstartedControls = ({ onConfirm, onCancel }) => (
  <ButtonGroup>
    <Button bsStyle="primary" onClick={onConfirm}>Confirm</Button>
    <Button bsStyle="danger" onClick={onCancel}>Cancel</Button>
  </ButtonGroup>
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
