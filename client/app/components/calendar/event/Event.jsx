import React, { PropTypes } from 'react';
import EventSchema from 'schemas/EventSchema';
import EventDestroyer from './EventDestroyer';
import EventDetails from './EventDetails';
import './event.scss';

export default class Event extends React.Component {
  static propTypes = {
    event: EventSchema.isRequired,
    userEmail: PropTypes.string.isRequired,
    containerHeight: PropTypes.number.isRequired,
    containerWidth: PropTypes.number.isRequired,
    unitEventLengthInSeconds: PropTypes.number.isRequired,
    timeFormat: PropTypes.string,
    onDelete: PropTypes.func.isRequired
  };

  render() {
    const event = this.props.event;
    const creator = event.creator || { self: false };
    const eventClassName = this._userParticipatesInEvent() ? 'event' : 'event not-participating';
    return (
      <div className={eventClassName} style={this._eventStyle()}>
        <EventDestroyer onDelete={this.props.onDelete}
                        disabled={!creator.self}
                        event={this.props.event} />
        <EventDetails event={event} timeFormat={this.props.timeFormat} />
      </div>
    );
  }

  _userParticipatesInEvent() {
    return this.props.event.attendees &&
           this.props.event.attendees.find(attendee => attendee.email === this.props.userEmail);
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
