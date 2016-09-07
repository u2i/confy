import React from 'react';
import { If, Else } from 'react-if';
import EventSchema from 'proptypes/schemas/EventSchema';

import EventDetails from 'components/calendar/event/details/EventDetails';

import './next_event.scss';

const NextEvents = ({ events, noEventLabel }) => (
  <div className="next-event-container">
    <h2>Next events</h2>
    <If condition={events.length > 0}>
      <div>
        {events.map(event => (
          <div className="event-container" key={event.id}>
            <EventDetails event={event} fields={['time', 'summary']} />
          </div>
        ))}
      </div>
      <Else>
        <p>{noEventLabel}</p>
      </Else>
    </If>
  </div>
);

NextEvents.propTypes = {
  events: React.PropTypes.arrayOf(EventSchema.only('id')).isRequired,
  noEventLabel: React.PropTypes.string
};

export default NextEvents;
