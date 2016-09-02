import flow from 'lodash/fp/flow';
import filter from 'lodash/fp/filter';
import map from 'lodash/map';
import React from 'react';
import UserSchema from 'proptypes/schemas/UserSchema';

const EventAttendees = ({ attendees }) => (
  <div className="event-attendees">
    <small>attendees:&nbsp;</small>
    <ul>
      {flow(
        filter(guest => !guest.self),
        (guests) => map(guests, (guest, i) => <li key={`attendee${i}`}>{guest.display_name || guest.email}</li>)
      )(attendees)}
    </ul>
  </div>
);

EventAttendees.propTypes = {
  attendees: React.PropTypes.arrayOf(UserSchema).isRequired
};

export default EventAttendees;
