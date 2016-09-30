import React from 'react';
import { instanceOfMoment } from 'proptypes/moment';

import eventTimeControls from './EventTimeControls';

const StaticControls = (props) => (
  <div className="event-controls">
    {eventTimeControls(props)}
  </div>
);

StaticControls.propTypes = {
  onCreate: React.PropTypes.func,
  nextEventStart: instanceOfMoment
};

export default StaticControls;
