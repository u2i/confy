import React, { PropTypes } from 'react'
import EventSchema from 'schemas/EventSchema'

import { formatTime, timestamp } from 'helpers/DateHelper'

import './event.scss'

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
    let event = this.props.event;
    let creator = event.creator;
    let timeStr = formatTime(event.start.date_time, this.props.timeFormat);

    return (<div className="event" style={this._eventStyle()}>
        <div className="event-time">{timeStr}</div>
        <div className="event-name">{event.name}</div>
        <div className="event-user">
          <small>by </small>
          {creator.display_name || creator.email}
        </div>
        <div className="event-location">
          <small>in </small>
          {event.conference_room.title}
        </div>
      </div>
    );
  }

  _eventHeight() {
    return this._eventLengthInSeconds() * this.props.containerHeight;
  }

  _eventLengthInSeconds() {
    let startTimestamp = timestamp(this.props.event.start.date_time),
        endTimestamp = timestamp(this.props.event.end.date_time);
    return (endTimestamp - startTimestamp) / this.props.unitEventLength;
  }

  _eventStyle() {
    return {
      backgroundColor: this.props.event.conference_room.color,
      height:          this._eventHeight()
    };
  }
}
