import React, { PropTypes } from 'react';
import EventSchema from 'schemas/EventSchema';
import DeleteButton from './DeleteButton';
import { formatTime } from 'helpers/DateHelper';
import './event.scss';

export default class Event extends React.Component {
  static propTypes = {
    event:                    EventSchema.isRequired,
    containerHeight:          PropTypes.number.isRequired,
    unitEventLengthInSeconds: PropTypes.number.isRequired,
    timeFormat:               PropTypes.string,
    onDelete:                 PropTypes.func.isRequired
  };

  render() {
    const event = this.props.event;
    const creator = event.creator;
    const startTimeStr = formatTime(event.start.date_time, this.props.timeFormat);
    const endTimeStr = formatTime(event.end.date_time, this.props.timeFormat);
    let timeStr = `${startTimeStr} - ${endTimeStr}`;

    return (
      <div className="event" style={this._eventStyle()}>
        <DeleteButton id={event.id}
                      onDelete={this.props.onDelete}
                      disabled={!creator.self}/>
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
    return (this.props.event.end_timestamp - this.props.event.start_timestamp) / this.props.unitEventLengthInSeconds;
  }

  _eventStyle() {
    return {
      backgroundColor: this.props.event.conference_room.color,
      height:          this._eventHeight()
    };
  }
}
