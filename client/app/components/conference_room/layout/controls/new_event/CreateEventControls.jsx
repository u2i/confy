import React from 'react';
import { instanceOfMoment } from 'proptypes/moment';

import StaticControls from './StaticControls';
import ToggleableControls from './ToggleableControls';

const CreateEventControls = (props) => {
  if (props.toggleText) {
    return <ToggleableControls {...props} />
  }
  const { toggleText, toggled, ...staticProps } = props;
  return <StaticControls {...staticProps} />
};

CreateEventControls.propTypes = {
  toggleText: React.PropTypes.string,
  onCreate: React.PropTypes.func,
  nextEventStart: instanceOfMoment,
  currentEventEnd: instanceOfMoment
};

export default CreateEventControls;
