import React from 'react';
import EventControls from './event/EventControls';
import NoEventControls from './NoEventControls';

const Controls = ({ event, onConfirm, onCreate, onCancel, onFinish, onExtend, nextEventStart }) => {
  if (event) {
    return (<EventControls event={event}
                           nextEventStart={nextEventStart}
                           onConfirm={onConfirm}
                           onCancel={onCancel}
                           onFinish={onFinish}
                           onExtend={onExtend} />);
  }
  return <NoEventControls onCreate={onCreate} nextEventStart={nextEventStart} />;
};

export default Controls;
