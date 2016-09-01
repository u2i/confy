import React from 'react';
import ConferenceRoomContainer from './ConferenceRoomContainer';
import EventSource from 'sources/EventSource';
import moment from 'moment';
import { currentAndNextEvent } from 'helpers/EventHelper';
import { EVENT_CHANNEL, createSubscription } from 'cable';
import RoomSchema from 'proptypes/schemas/ConferenceRoomSchema';

export default class ReactRoot extends React.Component {
  static propTypes = {
    conference_room: RoomSchema.isRequired
  };

  constructor(...args) {
    super(...args);
    this.state = {};
    this._fetchCurrentAndNextEvent = this._fetchCurrentAndNextEvent.bind(this);
    this.handleEventCompleted = this.handleEventCompleted.bind(this);
  }

  handleEventCompleted() {
    this._fetchCurrentAndNextEvent();
  }

  componentDidMount() {
    this._fetchCurrentAndNextEvent();
    createSubscription(EVENT_CHANNEL, this._fetchCurrentAndNextEvent);
  }

  render() {
    return <ConferenceRoomContainer currentEvent={this.state.currentEvent}
                                    nextEvent={this.state.nextEvent}
                                    conferenceRoom={this.props.conference_room}
                                    onCompleted={this.handleEventCompleted} />;
  }

  _fetchCurrentAndNextEvent() {
    EventSource.fetch(
      { start: moment().toISOString(), end: moment().endOf('day').toISOString() },
      this.props.conference_room.id
    ).then(response => {
      const { current, next } = currentAndNextEvent(response.data);
      this.setState({ nextEvent: next, currentEvent: current });
    });
  }
}
