import flow from 'lodash/fp/flow';
import filter from 'lodash/fp/filter';
import map from 'lodash/map';
import curryRight from 'lodash/fp/curryRight';
import React from 'react';
import { If } from 'react-if';
import EventSchema from 'proptypes/schemas/EventSchema';

const filterSelf = filter(guest => !guest.self);
const guestToListItem = (guest, i) => (<li key={`attendee${i}`}>{guest.display_name || guest.email}</li>);
const mapToList = curryRight(map)(guestToListItem);

const EventAttendees = ({ event }) => (
  <div className="event-attendees">
    <If condition={event.attendees.length > 0}>
      <div>
        <small>Attendees:&nbsp;</small>
        <ul>
          {flow(
            filterSelf,
            mapToList
          )(event.attendees)}
        </ul>
      </div>
    </If>
  </div>
);

EventAttendees.propTypes = {
  event: EventSchema.only('attendees').isRequired
};

export default EventAttendees;
