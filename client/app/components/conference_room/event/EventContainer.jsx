import React from 'react';
import { If, Then, Else } from 'react-if';
import EventSchema from 'proptypes/schemas/EventSchema';

const EventContainer = ({ event, label, noEventLabel, children }) => (
  <div className="event-container">
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
  event: EventSchema.except('width', 'offset'),
  label: React.PropTypes.string,
  noEventLabel: React.PropTypes.string,
  children: React.PropTypes.oneOfType([React.PropTypes.node, React.PropTypes.func])
};

export default EventContainer;
