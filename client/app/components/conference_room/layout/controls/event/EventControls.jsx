import React from 'react';
import { Button } from 'react-bootstrap';
import EventSchema from 'proptypes/schemas/EventSchema';

import InProgress from './InProgress';
import Unstarted from './Unstarted';

const EventControls = ({ event, onConfirm, onCancel, onFinish }) =>
  event.confirmed ?
    <InProgress onFinish={onFinish} /> :
    <Unstarted onCancel={onCancel} onConfirm={onConfirm} />;

EventControls.propTypes = {
  event: EventSchema.only('confirmed').isRequired,
  onConfirm: React.PropTypes.func,
  onCancel: React.PropTypes.func,
  onFinish: React.PropTypes.func
};

export default EventControls;
