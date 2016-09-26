import React from 'react';
import ConferenceRoomSource from 'app/sources/ConferenceRoomSource';
import { currentAndNextEvents } from 'helpers/EventHelper';
import moment from 'moment';
import { humanizeTime } from 'helpers/DateHelper';

export default class RoomsAvailability extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = { events: [], conferenceRooms: [] };
    this._fetchConferenceRooms();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.events !== this.state.events || this.state.conferenceRooms !== nextState.conferenceRooms;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ events: nextProps.events });
  }

  render() {
    return (
      <div>
        {this._availableRooms()}
      </div>
    );
  }

  _availableRooms() {
    return this.state.conferenceRooms.map(conferenceRoom => {
      return this._roomAvailability(conferenceRoom);
    });
  }

  _roomAvailability(conferenceRoom) {
    const events = this._eventsInConferenceRoom(this.state.events, conferenceRoom.id);
    if(events.length === 0) return this._noEventsToday(conferenceRoom);

    const { current, next } = currentAndNextEvents(events);
    if(current === undefined) return this._roomAvailabilityTime(conferenceRoom, next[0]);
  }

  _eventsInConferenceRoom(events, conferenceRoomId) {
   return events.filter(event => event.conference_room.id === conferenceRoomId);
  }

  _noEventsToday(conferenceRoom) {
    return <p>{conferenceRoom.title + " AVAILABLE"}</p>;
  }

  _roomAvailabilityTime(conferenceRoom, nextEvent) {
    const startTime = moment(nextEvent.start.date_time);
    const duration = moment.duration(startTime.diff(moment()));
    return <p>{conferenceRoom.title + humanizeTime(duration)}</p>;
  }

  _fetchConferenceRooms() {
    ConferenceRoomSource.fetch()
      .then(response => {
        this.setState({ conferenceRooms: this._otherConferenceRooms(response.data) });
    });
  }

  _otherConferenceRooms(conferenceRooms) {
    return conferenceRooms.filter(conferenceRoom => conferenceRoom.id !== this.props.conferenceRoom.id);
  }
}
