import React from 'react';
import CreateEventControls from './new_event/CreateEventControls';

const NoEventControls = ({ onCreate, nextEventStart }) => (
  <CreateEventControls toggleText='Start' onCreate={onCreate} nextEventStart={nextEventStart} />
);

export default NoEventControls;
