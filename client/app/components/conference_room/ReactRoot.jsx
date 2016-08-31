import React from 'react';
import sortBy from 'lodash/sortBy';
import ConferenceRoomContainer from './ConferenceRoomContainer';
import EventSource from 'sources/EventSource';
import moment from 'moment';
import { dateParam } from 'helpers/DateHelper';
import { EVENT_CHANNEL, createSubscription } from 'cable';

export default class ReactRoot extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {};
    this._fetchCurrentAndNextEvent = this._fetchCurrentAndNextEvent.bind(this)
    this.handleEventCompleted = this.handleEventCompleted.bind(this)
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
      const events = sortBy(response.data, 'start_timestamp');
      const currentEventIndex = events.findIndex((event) => moment(event.start.date_time) <= moment());
      const nextEvent = currentEventIndex > -1 ? events[currentEventIndex + 1] : events[0];
      this.setState({ nextEvent, currentEvent: events[currentEventIndex] });
    });
  }
}
