import React from 'react';
import { formatDuration } from 'helpers/DateHelper';
import 'moment-duration-format';

import './availability.scss';

const CurrentlyAvailable = ({ conferenceRoomTitle, duration }) => {
  console.log(conferenceRoomTitle, duration);
  return (
  <p className="available">
    <span className="conference-room">{conferenceRoomTitle}</span>
    available for {formatDuration(duration)}
  </p>
  );
};

CurrentlyAvailable.propTypes = {
  conferenceRoomTitle: React.PropTypes.string.isRequired,
  duration: React.PropTypes.object.isRequired
};

export default CurrentlyAvailable;
