import React from 'react';
import { humanizeTime } from 'helpers/DateHelper';

import './availability.scss';

const CurrentlyAvailable = ({ conferenceRoomTitle, duration }) => (
  <p className="available">
    <span className="conference-room">{conferenceRoomTitle}</span>
    available for {humanizeTime(duration)}
  </p>
);

CurrentlyAvailable.propTypes = {
  conferenceRoomTitle: React.PropTypes.string.isRequired,
  duration: React.PropTypes.object.isRequired
};

export default CurrentlyAvailable;
