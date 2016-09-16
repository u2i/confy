import set from 'lodash/set';
import moment from 'moment';
import React from 'react';
import { EVENT_CHANNEL, createSubscription, removeSubscription } from 'cable';
import EventSource from 'sources/EventSource';
import ConferenceRoomSchema from 'schemas/ConferenceRoomSchema';
import { currentAndNextEvents } from 'helpers/EventHelper';
import bindAll from 'lodash/bindAll';

export default class EventProvider extends React.Component {
  static propTypes = {
    conferenceRoom: ConferenceRoomSchema.isRequired,
    component: React.PropTypes.func.isRequired
  };

  constructor(...args) {
    super(...args);
    this.state = { nextEvents: [] };
    bindAll(this, ['_fetchForToday', 'handleUpdate', '_confirmEvent']);
  }

  componentDidMount() {
    this._fetchForToday();
    this._channelSubscription = createSubscription(EVENT_CHANNEL, this._fetchForToday);
    this.setEndOfDayTimeout();
  }

  componentWillUnmount() {
    removeSubscription(this._channelSubscription);
    window.clearTimeout(this.endOfDayTimeout);
  }

  handleUpdate() {
    this._fetchForToday();
  }

  setEndOfDayTimeout() {
    const now = moment();
    const timeToBeginningOfTheNextDay = now.clone().add(1, 'day').startOf('day') - now;
    this.endOfDayTimeout = setTimeout(() => {
      this._fetchForToday();
      this.setEndOfDayTimeout();
    }, timeToBeginningOfTheNextDay);
  }

  render() {
    const { component: Component, ...props } = this.props;
    return (
      <Component currentEvent={this.state.currentEvent}
                 nextEvents={this.state.nextEvents}
                 onUpdate={this.handleUpdate}
                 onConfirm={this._confirmEvent}
                 {...props} />
    );
  }

  _fetchForToday() {
    const params = {
      start: moment().toISOString(),
      end: moment().endOf('day').toISOString(),
      confirmation: true
    };
    EventSource.fetch(params, this.props.conferenceRoom.id
    ).then(response => {
      const { current, next } = currentAndNextEvents(response.data);
      this.setState({ nextEvents: next, currentEvent: current });
    });
  }

  _confirmEvent() {
    if (typeof(this.state.currentEvent) === 'undefined') {
      return;
    }

    this._toggleConfirmed();
    EventSource.confirm(this.props.conferenceRoom.id, this.state.currentEvent.id)
      .catch(() => this._toggleConfirmed());
  }

  _toggleConfirmed() {
    this.setState(state => {
      const currentEvent = state.currentEvent;
      return { currentEvent: set(currentEvent, 'confirmed', !currentEvent.confirmed) };
    });
  }
}
