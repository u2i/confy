import React, { PropTypes } from 'react'
import { formatTime } from 'helpers/dateHelper'

import './event.scss'

export default class Event extends React.Component {
  static propTypes = {
    event: PropTypes.shape({
      name: PropTypes.string,
      start_time: PropTypes.string.isRequired,
      end_time: PropTypes.string.isRequired,
      user: PropTypes.string.isRequired,
      conference_room: PropTypes.shape({
        title: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    timeFormat: PropTypes.string
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
