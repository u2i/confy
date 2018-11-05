import moment from 'moment';
import React from 'react';

import InProgress from './InProgress';
import Unstarted from './Unstarted';

const EventControls = ({ event, nextEventStart, onConfirm, onCancel, onFinish, onExtend }) => {
  if (event.confirmed) {
    return (<InProgress onFinish={onFinish}
                        onExtend={(end) => onExtend(event.id, end)}
                        nextEventStart={nextEventStart}
                        currentEventEnd={moment(event.end.date_time)} />);
  }
  return <Unstarted onCancel={onCancel} onConfirm={onConfirm} />;
};

EventControls.defaultProps = {
  onExtend: () => {}
};

export default EventControls;
