import React from 'react';
import 'moment-duration-format';
import { formatDuration } from 'helpers/DateHelper';

import './availability.scss';

const CurrentlyBusy = ({ conferenceRoomTitle, duration }) => (
  <p className="unavailable">
    <span className="conference-room">{conferenceRoomTitle}</span>
    available in {formatDuration(duration)}
  </p>
);

CurrentlyBusy.propTypes = {
  conferenceRoomTitle: React.PropTypes.string.isRequired,
  duration: React.PropTypes.object.isRequired
};

export default CurrentlyBusy;
