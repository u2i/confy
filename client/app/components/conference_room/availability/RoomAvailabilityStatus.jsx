import React from 'react';
import { AVAILABILITY } from 'helpers/AvailabilityHelper';
import { formatDuration } from 'helpers/DateHelper';
import './availability.scss';
const { ALL_DAY_AVAILABLE, CURRENTLY_AVAILABLE, CURRENTLY_BUSY } = AVAILABILITY;

export default class RoomAvailabilityStatus extends React.Component {
  static propTypes = {
    conferenceRoomTitle: React.PropTypes.string.isRequired,
    availability: React.PropTypes.number.isRequired,
    duration: React.PropTypes.object
  };

  render() {
    return (
      <p className={this._availabilityClassName()}>
        <span className="conference-room">{this.props.conferenceRoomTitle}</span>
        {this._availabilityStatus()}
      </p>
    );
  }

  _availabilityClassName() {
    return this.props.availability === CURRENTLY_BUSY ? 'unavailable' : 'available';
  }

  _availabilityStatus() {
    switch (this.props.availability) {
      case ALL_DAY_AVAILABLE:
        return 'available for the whole day';
      case CURRENTLY_AVAILABLE:
        return `available for ${this._remainingTime()}`;
      case CURRENTLY_BUSY:
        return `available in ${this._remainingTime()}`;
    }
  }

  _remainingTime() {
    return formatDuration(this.props.duration, 'HH:mm');
  }
}
