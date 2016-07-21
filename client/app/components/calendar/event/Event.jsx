import React, { PropTypes } from 'react'
import moment from 'moment'

import './event.scss'

export default class Event extends React.Component {
  // static propTypes = {
  //   startTime: PropTypes.required.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  //   endTime: PropTypes.required.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  //   user: PropTypes.required.string,
  //   conferenceRoom: PropTypes.required.string
  // };

  static _formatTime(date) {
    return moment(date).format('HH:mm');
  }
  
  _eventStyle() {
    return {
      backgroundColor: this.props.color
    };
  }

  render() {
    return (<div className="event" data-id={this.props.id} style={this._eventStyle()}>
        <div className="event-time">{Event._formatTime(this.props.startTime)}</div>
        <div className="event-name">{this.props.name || 'Untitled'}</div>
        <div className="event-user">
          <small>by</small>
          {this.props.user}
        </div>
        <div className="event-location">
          <small>in</small>
          {this.props.conferenceRoom}
        </div>
      </div>
    );
  }
}
