import React from 'react';

import './availability.scss';

const AllDayAvailable = ({ conferenceRoomTitle }) => (
  <p className="available">
    <span className="conference-room">{conferenceRoomTitle}</span>
    available for the whole day
  </p>
);

AllDayAvailable.propTypes = {
  conferenceRoomTitle: React.PropTypes.string.isRequired
};

export default AllDayAvailable;
