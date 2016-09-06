import flow from 'lodash/fp/flow';
import filter from 'lodash/fp/filter';
import map from 'lodash/map';
import curryRight from 'lodash/fp/curryRight';
import React from 'react';
import UserSchema from 'proptypes/schemas/UserSchema';

const filterSelf = filter(guest => !guest.self);
const guestToListItem = (guest, i) => (<li key={`attendee${i}`}>{guest.display_name || guest.email}</li>);
const mapToList = curryRight(map)(guestToListItem);

const EventAttendees = ({ attendees }) => (
  <div className="event-attendees">
    <small>attendees:&nbsp;</small>
    <ul>
      {flow(
        filterSelf,
        mapToList
      )(attendees)}
    </ul>
  </div>
);

EventAttendees.propTypes = {
  attendees: React.PropTypes.arrayOf(UserSchema).isRequired
};

export default EventAttendees;
