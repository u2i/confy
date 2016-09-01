import moment from 'moment';
import React from 'react';
import { EVENT_CHANNEL, createSubscription, removeSubscription } from 'cable';
import EventSource from 'sources/EventSource';
import ConferenceRoomSchema from 'schemas/ConferenceRoomSchema';
import { currentAndNextEvent } from 'helpers/EventHelper';

export default class EventProvider extends React.Component {
  static propTypes = {
    conferenceRoom: ConferenceRoomSchema.isRequired,
    component: React.PropTypes.func.isRequired
  };

  constructor(...args) {
    super(...args);
    this.state = {};
    this._fetchCurrentAndNextEvent = this._fetchCurrentAndNextEvent.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount() {
    this._fetchCurrentAndNextEvent();
    this._channelSubscription = createSubscription(EVENT_CHANNEL, this._fetchCurrentAndNextEvent);
  }

  componentWillUnmount() {
    removeSubscription(this._channelSubscription);
  }

  handleUpdate() {
    this._fetchCurrentAndNextEvent();
  }

  render() {
    const { component: Component, ...props } = this.props;
    return (
      <Component currentEvent={this.state.currentEvent}
                 nextEvent={this.state.nextEvent}
                 onUpdate={this.handleUpdate}
                 {...props} />
    );
  }

  _fetchCurrentAndNextEvent() {
    EventSource.fetch(
      { start: moment().toISOString(), end: moment().endOf('day').toISOString() },
      this.props.conferenceRoom.id
    ).then(response => {
      const { current, next } = currentAndNextEvent(response.data);
      this.setState({ nextEvent: next, currentEvent: current });
    });
  }
}
