import React from 'react';
import { If, Else } from 'react-if';
import EventSchema from 'proptypes/schemas/EventSchema';

import EventSummary from 'components/calendar/event/details/EventSummary';
import EventTime from 'components/calendar/event/details/EventTime';
import EventCreator from 'components/calendar/event/details/EventCreator';
import './next_events.scss';

const NextEvents = ({ events, noEventLabel }) => (
  <div className="next-event-container">
    <If condition={events.length > 0}>
      <div>
        {events.map(event => (
          <div className="event-container" key={event.id}>
            <EventTime event={event} />
            <EventSummary event={event} />
            <EventCreator event={event} />
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
