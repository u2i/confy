import moment from 'moment';
import React from 'react';
import { EVENT_CHANNEL, createSubscription, removeSubscription } from 'cable';
import EventSource from 'sources/EventSource';
import ConferenceRoomSchema from 'schemas/ConferenceRoomSchema';
import { currentAndNextEvents } from 'helpers/EventHelper';

export default class EventProvider extends React.Component {
  static propTypes = {
    conferenceRoom: ConferenceRoomSchema.isRequired,
    component: React.PropTypes.func.isRequired
  };

  constructor(...args) {
    super(...args);
    this.state = { nextEvents: [] };
    this._fetchForToday = this._fetchForToday.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount() {
    this._fetchForToday();
    this._channelSubscription = createSubscription(EVENT_CHANNEL, this._fetchForToday);
  }

  componentWillUnmount() {
    removeSubscription(this._channelSubscription);
  }

  handleUpdate() {
    this._fetchForToday();
  }

  render() {
    const { component: Component, ...props } = this.props;
    return (
      <Component currentEvent={this.state.currentEvent}
                 nextEvents={this.state.nextEvents}
                 onUpdate={this.handleUpdate}
                 {...props} />
    );
  }

  _fetchForToday() {
    EventSource.fetch(
      { start: moment().toISOString(), end: moment().endOf('day').toISOString() },
      this.props.conferenceRoom.id
    ).then(response => {
      const { current, next } = currentAndNextEvents(response.data);
      this.setState({ nextEvents: next, currentEvent: current });
    });
  }
}
