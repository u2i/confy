import React from 'react';
import ConferenceRoomSource from 'app/sources/ConferenceRoomSource';
import RoomAvailabilityStatus from 'components/conference_room/availability/RoomAvailabilityStatus';
import { AVAILABILITY, sortAvailabilityProps, buildAvailabilityProps } from 'helpers/AvailabilityHelper';
import EventSchema from 'proptypes/schemas/EventSchema';

export default class RoomsAvailability extends React.Component {
  static propTypes = {
    events: React.PropTypes.arrayOf(EventSchema.except('width', 'offset')).isRequired
  };

  constructor(...args) {
    super(...args);
    this.state = { conferenceRooms: [] };
    this._fetchConferenceRooms();
    this.refreshInterval = setInterval(() => this.forceUpdate(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.refreshInterval);
  }

  render() {
    return <div>{this._roomsAvailability()}</div>;
  }

  _roomsAvailability() {
    let availabilityProps = buildAvailabilityProps(this.state.conferenceRooms, this.props.events);
    sortAvailabilityProps(availabilityProps);
    return availabilityProps.map(props => <RoomAvailabilityStatus key={props.conferenceRoom.id} {...props} />);
  }

  _fetchConferenceRooms() {
    ConferenceRoomSource.fetch()
      .then(response => {
        this.setState({ conferenceRooms: response.data });
    });
  }
}
