import React from 'react';

import StaticControls from './StaticControls';
import ToggleableControls from './ToggleableControls';

const CreateEventControls = (props) => {
  if (props.toggleText) {
    return <ToggleableControls {...props} />;
  }
  const { toggleText, ...staticProps } = props;
  return <StaticControls {...staticProps} />;
};

export default CreateEventControls;
