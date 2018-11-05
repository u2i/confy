import React from 'react';
import eventTimeControls from './EventTimeControls';

const StaticControls = (props) => (
  <View>
    {eventTimeControls(props)}
  </View>
);

export default StaticControls;
