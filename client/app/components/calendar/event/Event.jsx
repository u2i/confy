import React, { PropTypes } from 'react';
import EventSchema from 'schemas/EventSchema';
import EventDestroyer from './EventDestroyer';
import EventDetails from './details/EventDetails';
import EventAdditionalDetails from './details/EventAdditionalDetails';
import classNames from 'classnames';
import enhanceWithClickOutside from 'react-click-outside';
import { If } from 'react-if';
import './event.scss';

export default class Event extends React.Component {
  static propTypes = {
    event: EventSchema.except('creator').isRequired,
    containerHeight: PropTypes.number.isRequired,
    containerWidth: PropTypes.number.isRequired,
    unitEventLengthInSeconds: PropTypes.number.isRequired,
    timeFormat: PropTypes.string,
    onDelete: PropTypes.func.isRequired
  };

  constructor(...args) {
    super(...args);
    this.state = { expanded: false };

    this._toggleDetails = this._toggleDetails.bind(this);
  }

  handleClickOutside() {
    this.setState({ expanded: false });
  }

  render() {
    const event = this.props.event;
    const creator = event.creator || { self: false };
    return (
      <div className={this._className()} 
           style={this._eventStyle()} 
           onClick={this._toggleDetails}>
        <EventDestroyer onDelete={this.props.onDelete}
                        disabled={!creator.self}
                        event={this.props.event} />
        <EventDetails event={event} 
                      timeFormat={this.props.timeFormat} />
        <If condition={this.state.expanded}>
          <EventAdditionalDetails event={event} />
        </If>
      </div>
    );
  }

  _toggleDetails() {
    this.setState({ expanded: !this.state.expanded });
  }

  _className() {
    return classNames(
      'event',
      {
        'not-participating': !this._userParticipatesInEvent(),
        'expanded': this.state.expanded
      }
    );
  }

  _userParticipatesInEvent() {
    return this._userIsAttendee() || this._userIsCreator();
  }

  _userIsAttendee() {
    return this.props.event.attendees &&
           this.props.event.attendees.find(attendee => attendee.email === this.context.userEmail);
  }

  _userIsCreator() {
    return this.props.event.creator && this.props.event.creator.email === this.context.userEmail;
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

module.exports = enhanceWithClickOutside(Event);

Event.contextTypes = {
  userEmail: React.PropTypes.string
};
