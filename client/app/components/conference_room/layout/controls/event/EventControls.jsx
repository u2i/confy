import moment from 'moment';
import React from 'react';
import EventSchema from 'proptypes/schemas/EventSchema';
import { instanceOfMoment } from 'proptypes/moment';

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

EventControls.propTypes = {
  event: EventSchema.only('confirmed', 'end').isRequired,
  nextEventStart: instanceOfMoment,
  onConfirm: React.PropTypes.func,
  onCancel: React.PropTypes.func,
  onFinish: React.PropTypes.func,
  onExtend: React.PropTypes.func
};

EventControls.defaultProps = {
  onExtend: () => {}
};

export default EventControls;
