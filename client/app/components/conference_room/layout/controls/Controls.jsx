import React from 'react';
import { instanceOfMoment } from 'proptypes/moment';
import EventSchema from 'schemas/EventSchema';

import EventControls from './event/EventControls';
import NoEventControls from './NoEventControls';

import './controls.scss';

const Controls = ({ event, onConfirm, onCreate, onCancel, onFinish, onExtend, nextEventStart }) => {
  if (event) {
    return <EventControls event={event}
                          nextEventStart={nextEventStart}
                          onConfirm={onConfirm}
                          onCancel={onCancel}
                          onFinish={onFinish}
                          onExtend={onExtend}/>;
  }
  return <NoEventControls onCreate={onCreate} nextEventStart={nextEventStart} />;
};

Controls.propTypes = {
  event: EventSchema.only('confirmed'),
  onConfirm: React.PropTypes.func,
  onCreate: React.PropTypes.func,
  onCancel: React.PropTypes.func,
  onFinish: React.PropTypes.func,
  onExtend: React.PropTypes.func,
  nextEventStart: instanceOfMoment
};

export default Controls;
