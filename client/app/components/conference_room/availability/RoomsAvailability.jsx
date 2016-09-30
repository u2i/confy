import React from 'react';
import RoomAvailabilityStatus from 'components/conference_room/availability/RoomAvailabilityStatus';
import { sortAvailabilityProps, buildAvailabilityProps } from 'helpers/AvailabilityHelper';
import EventSchema from 'proptypes/schemas/EventSchema';
import ConferenceRoomSchema from 'proptypes/schemas/ConferenceRoomSchema';

export default class RoomsAvailability extends React.Component {
  static propTypes = {
    events: React.PropTypes.arrayOf(EventSchema.except('width', 'offset')).isRequired,
    allConferenceRooms: React.PropTypes.arrayOf(ConferenceRoomSchema).isRequired
  };

  constructor(...args) {
    super(...args);
    this.refreshAvailabilityInterval = setInterval(() => this.forceUpdate(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.refreshAvailabilityInterval);
  }

  render() {
    return <div>{this._roomsAvailability()}</div>;
  }

  _roomsAvailability() {
    const availabilityProps = buildAvailabilityProps(this.props.allConferenceRooms, this.props.events);
    sortAvailabilityProps(availabilityProps);
    return availabilityProps.map(props => <RoomAvailabilityStatus key={props.conferenceRoom.id} {...props} />);
  }
}
