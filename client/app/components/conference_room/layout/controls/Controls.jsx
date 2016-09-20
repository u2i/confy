import React from 'react';
import { instanceOfMoment } from 'proptypes/moment';
import EventSchema from 'schemas/EventSchema';

import EventControls from './event/EventControls';
import NoEventControls from './NoEventControls';

import './controls.scss';

const Controls = ({ event, onConfirm, onCreate, onCancel, onFinish, nextEventStart }) =>
  event ?
    <EventControls event={event} onConfirm={onConfirm} onCancel={onCancel} onFinish={onFinish} /> :
    <NoEventControls onCreate={onCreate} nextEventStart={nextEventStart} />;

Controls.propTypes = {
  event: EventSchema.only('confirmed'),
  onConfirm: React.PropTypes.func,
  onCreate: React.PropTypes.func,
  onCancel: React.PropTypes.func,
  onFinish: React.PropTypes.func,
  nextEventStart: instanceOfMoment
};

export default Controls;
