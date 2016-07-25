import React, { PropTypes } from 'react'
const {string, shape, oneOfType, instanceOf} = PropTypes;

import { formatTime } from 'helpers/dateHelper'

import './event.scss'

export default class Event extends React.Component {
  static propTypes = {
    event:      shape({
      name:            string,
      start_time:      oneOfType([instanceOf(Date), string]).isRequired,
      end_time:        oneOfType([instanceOf(Date), string]).isRequired,
      user:            string.isRequired,
      conference_room: shape({
        title: string.isRequired,
        color: string.isRequired
      }).isRequired
    }).isRequired,
    timeFormat: string
  };

  render() {
    let timeStr = formatTime(this.props.event.start_time, this.props.timeFormat);

    return (<div className="event" style={this._eventStyle()}>
        <div className="event-time">{timeStr}</div>
        <div className="event-name">{this.props.event.name}</div>
        <div className="event-user">
          <small>by</small>
          {this.props.event.user}
        </div>
        <div className="event-location">
          <small>in</small>
          {this.props.event.conference_room.title}
        </div>
      </div>
    );
  }

  _eventStyle() {
    return {
      backgroundColor: this.props.event.conference_room.color
    };
  }
}
