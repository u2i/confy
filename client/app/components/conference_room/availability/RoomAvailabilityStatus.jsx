import React from 'react';
import { AVAILABILITY } from 'helpers/AvailabilityHelper';
import { formatDuration } from 'helpers/DateHelper';
import ConferenceRoomSchema from 'proptypes/schemas/ConferenceRoomSchema';
import { instanceOfDuration } from 'proptypes/moment';
import values from 'lodash/values';
import './availability.scss';

const { ALL_DAY_AVAILABLE, CURRENTLY_AVAILABLE, CURRENTLY_BUSY } = AVAILABILITY;

const availabilityClassName = availability => availability === CURRENTLY_BUSY ? 'unavailable' : 'available';
const remainingTime = duration => formatDuration(duration, 'HH:mm');
const availabilityStatus = (availability, duration) => {
  switch (availability) {
    case ALL_DAY_AVAILABLE:
      return 'available for the whole day';
    case CURRENTLY_AVAILABLE:
      return `available for ${remainingTime(duration)}`;
    case CURRENTLY_BUSY:
      return `available in ${remainingTime(duration)}`;
    default:
      return '';
  }
};

const RoomAvailabilityStatus = ({ conferenceRoom, availability, duration }) => (
  <p className={availabilityClassName(availability)}>
    <span className="conference-room">{conferenceRoom.title}</span>
    {availabilityStatus(availability, duration)}
  </p>
);

RoomAvailabilityStatus.propTypes = {
  conferenceRoom: ConferenceRoomSchema.only('title').isRequired,
  availability: React.PropTypes.oneOf(values(AVAILABILITY)),
  duration: instanceOfDuration
};

export default RoomAvailabilityStatus;
