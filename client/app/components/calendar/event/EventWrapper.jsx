import React from 'react';
import dimension from 'react-dimensions';
import { If, Then } from 'react-if';

import EventGroup from './EventGroup';

const EventWrapper = (props) => (
  <If condition={props.events != null}>
    <Then>{() =>
      <EventGroup {...props} />}
    </Then>
  </If>
);

EventWrapper.propTypes = {
  events: React.PropTypes.array
};

export default dimension()(EventWrapper);
