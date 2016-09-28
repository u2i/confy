import React from 'react';
import { formatDuration } from 'helpers/DateHelper';

import './availability.scss';

const CurrentlyBusy = ({ conferenceRoomTitle, duration }) => (
  <p className="unavailable">
    <span className="conference-room">{conferenceRoomTitle}</span>
    available in {formatDuration(duration, 'HH:mm')}
  </p>
);

CurrentlyBusy.propTypes = {
  conferenceRoomTitle: React.PropTypes.string.isRequired,
  duration: React.PropTypes.object.isRequired
};

export default CurrentlyBusy;
