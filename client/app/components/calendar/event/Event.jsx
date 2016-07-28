import React, { PropTypes } from 'react';
import EventSchema from 'schemas/EventSchema';

import { formatTime, timestamp } from 'helpers/DateHelper';

import './event.scss';

export default class Event extends React.Component {
  static propTypes = {
    event:           EventSchema.isRequired,
    containerHeight: PropTypes.number.isRequired,
    unitEventLength: PropTypes.number,
    timeFormat:      PropTypes.string
  };

  static defaultProps = {
    unitEventLength: 60 // seconds
  };

  render() {
    const event = this.props.event;
    const creator = event.creator;
    let timeStr = formatTime(event.start.date_time, this.props.timeFormat);

    return (
      <div className="event" style={this._eventStyle()}>
        <div className="event-time">{timeStr}</div>
        <div className="event-name">{event.summary}</div>
        <div className="event-user">
          <small>by&nbsp;</small>
          {creator.display_name || creator.email}
        </div>
        <div className="event-location">
          <small>in&nbsp;</small>
          {event.conference_room.title}
        </div>
      </div>
    );
  }

  _eventHeight() {
    return this._eventLengthInSeconds() * this.props.containerHeight;
  }

  _eventLengthInSeconds() {
    return (this.props.event.end_timestamp - this.props.event.start_timestamp) / this.props.unitEventLength;
  }

  _eventStyle() {
    return {
      backgroundColor: this.props.event.conference_room.color,
      height:          this._eventHeight()
    };
  }
}
