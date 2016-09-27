import React from 'react';
import { humanizeTime } from 'helpers/DateHelper';

import './availability.scss';

const Busy = ({ conferenceRoomTitle, duration }) => (
  <p className="unavailable">
    <span className="conference-room">{conferenceRoomTitle}</span>
    available in {humanizeTime(duration)}
  </p>
);

Busy.propTypes = {
  conferenceRoomTitle: React.PropTypes.string.isRequired,
  duration: React.PropTypes.object.isRequired
};

export default Busy;