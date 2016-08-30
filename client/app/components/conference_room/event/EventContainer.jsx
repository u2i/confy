import React from 'react';
import { If, Then, Else } from 'react-if';
import EventSchema from 'proptypes/schemas/EventSchema';

const EventContainer = ({ event, label, noEventLabel, children }) => (
  <div>
    <h2>{label}</h2>
    <If condition={event != null}>
      <Then>
        {children}
      </Then>
      <Else>
        <p>{noEventLabel}</p>
      </Else>
    </If>
  </div>
);

EventContainer.propTypes = {
  event: EventSchema,
  label: React.PropTypes.string.isRequired,
  noEventLabel: React.PropTypes.string.isRequired,
  children: React.PropTypes.func
};

export default EventContainer;
