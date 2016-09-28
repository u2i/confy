import React from 'react';
import { humanizeTime } from 'helpers/DateHelper';
import 'moment-duration-format';

import './availability.scss';

const CurrentlyAvailable = ({ conferenceRoomTitle, duration }) => {
  console.log(conferenceRoomTitle, duration);
  return (
  <p className="available">
    <span className="conference-room">{conferenceRoomTitle}</span>
    available for {duration.format("hh:mm", { trim: false })}
  </p>
  );
};

CurrentlyAvailable.propTypes = {
  conferenceRoomTitle: React.PropTypes.string.isRequired,
  duration: React.PropTypes.object.isRequired
};

export default CurrentlyAvailable;
