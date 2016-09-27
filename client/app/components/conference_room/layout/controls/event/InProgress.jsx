import React from 'react';
import { Button } from 'react-bootstrap';
import { instanceOfMoment } from 'proptypes/moment';

import CreateEventControls from '../new_event/CreateEventControls';

const InProgress = ({ nextEventStart, currentEventEnd, onFinish, onExtend }) => (
  <CreateEventControls toggleText="Extend"
                       onCreate={onExtend}
                       nextEventStart={nextEventStart}
                       currentEventEnd={currentEventEnd}>
    <h3>Confirmed!</h3>
    <Button bsStyle="danger" bsSize="large" onClick={onFinish}>Finish</Button>
  </CreateEventControls>
);

InProgress.propTypes = {
  nextEventStart: instanceOfMoment,
  currentEventEnd: instanceOfMoment,
  onFinish: React.PropTypes.func,
  onExtend: React.PropTypes.func
};

export default InProgress;
