import React from 'react';
import EventSchema from 'schemas/EventSchema';

import EventControls from './event/EventControls';
import NoEventControls from './NoEventControls';

const Controls = ({ event, onConfirm, onStart, onCancel, onFinish }) =>
  event ?
    <EventControls event={event} onConfirm={onConfirm} onCancel={onCancel} onFinish={onFinish} /> :
    <NoEventControls onStart={onStart} />;

Controls.propTypes = {
  event: EventSchema.only('confirmed'),
  onConfirm: React.PropTypes.func,
  onStart: React.PropTypes.func,
  onCancel: React.PropTypes.func,
  onFinish: React.PropTypes.func
};

export default Controls;
