import React from 'react';
import ConferenceRoomSource from 'app/sources/ConferenceRoomSource';
import { currentAndNextEvents } from 'helpers/EventHelper';
import { humanizeTime, durationFromNow } from 'helpers/DateHelper';
import AllDayAvailable from 'components/conference_room/availability/AllDayAvailable';
import CurrentlyAvailable from 'components/conference_room/availability/CurrentlyAvailable';
import Busy from 'components/conference_room/availability/Busy';
import uuid from 'uuid';
import { AVAILABILITY, sortByAvailability, buildAvailabilityProps } from 'helpers/AvailabilityHelper';

const allDayAvailableComponent = (props) =>
  <AllDayAvailable key={uuid()} conferenceRoomTitle={props.conferenceRoomTitle} />;

const currentlyAvailableComponent = (props) =>
  <CurrentlyAvailable key={uuid()} conferenceRoomTitle={props.conferenceRoomTitle} duration={props.duration} />;

const busyComponent = (props) =>
  <Busy key={uuid()} conferenceRoomTitle={props.conferenceRoomTitle} duration={props.duration} />;

export default class RoomsAvailability extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = { events: [], conferenceRooms: [] };
    this._fetchConferenceRooms();
    this.refreshInterval = setInterval(() => this.forceUpdate(), 1000);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.events !== this.state.events || this.state.conferenceRooms !== nextState.conferenceRooms;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ events: nextProps.events });
  }

  componentWillUnmount() {
    clearInterval(this.refreshInterval);
  }

  render() {
    return <div>{this._roomsAvailability()}</div>;
  }

  _roomsAvailability() {
    let availabilityProps = buildAvailabilityProps(this.state.conferenceRooms, this.state.events);
    sortByAvailability(availabilityProps);
    return availabilityProps.map(props => this._availabilityComponent(props));
  }

  _availabilityComponent(props) {
    switch (props.availability) {
      case AVAILABILITY.ALL_DAY_AVAILABLE:
        return allDayAvailableComponent(props);
      case AVAILABILITY.CURRENTLY_AVAILABLE:
        return currentlyAvailableComponent(props);
      case AVAILABILITY.BUSY:
        return busyComponent(props);
    }
  }

  _fetchConferenceRooms() {
    ConferenceRoomSource.fetch()
      .then(response => {
        this.setState({ conferenceRooms: response.data });
    });
  }
}
