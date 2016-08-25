import React, { PropTypes } from 'react';
import EventSchema from 'schemas/EventSchema';
import EventDestroyer from './EventDestroyer';
import { eventTimeString } from 'helpers/DateHelper';
import './event.scss';

export default class Event extends React.Component {
  static propTypes = {
    event: EventSchema.isRequired,
    containerHeight: PropTypes.number.isRequired,
    containerWidth: PropTypes.number.isRequired,
    unitEventLengthInSeconds: PropTypes.number.isRequired,
    timeFormat: PropTypes.string,
    onDelete: PropTypes.func.isRequired
  };

  render() {
    const event = this.props.event;
    const creator = event.creator || { self: false };

    return (
      <div className="event" style={this._eventStyle()}>
        <EventDestroyer onDelete={this.props.onDelete}
                        disabled={!creator.self}
                        event={this.props.event} />
        <div className="event-time">{eventTimeString(this.props.event, this.props.timeFormat)}</div>
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

  _eventWidth() {
    return this.props.event.width * this.props.containerWidth;
  }

  _eventOffset() {
    const { width, offset } = this.props.event;
    const containerWidth = this.props.containerWidth;
    return width * containerWidth * offset;
  }

  _eventLengthInSeconds() {
    return (this.props.event.end_timestamp - this.props.event.start_timestamp) / this.props.unitEventLengthInSeconds;
  }

  _eventStyle() {
    return {
      backgroundColor: this.props.event.conference_room.color,
      minHeight: this._eventHeight(),
      width: this._eventWidth(),
      left: this._eventOffset()
    };
  }
}
