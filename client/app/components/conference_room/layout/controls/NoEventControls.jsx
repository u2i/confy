import React from 'react';
import { instanceOfMoment } from 'proptypes/moment';

import CreateEventControls from './new_event/CreateEventControls';

const NoEventControls = ({ onCreate, nextEventStart }) => (
  <CreateEventControls toggleText="Start" onCreate={onCreate} nextEventStart={nextEventStart} />
);

NoEventControls.propTypes = {
  onCreate: React.PropTypes.func,
  nextEventStart: instanceOfMoment
};

export default NoEventControls;
