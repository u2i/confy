import React from 'react';
import { eventTimeString } from 'helpers/DateHelper';
import EventSchema from 'schemas/EventSchema';
import './event.scss';

export default class EventDetails extends React.Component {
  static propTypes = {
    event: EventSchema.except('creator').isRequired,
    timeFormat: React.PropTypes.string
  };

  render() {
    const undefinedCreator = { display_name: 'private', self: false };
    const creator = this.props.event.creator || undefinedCreator;
    return (
      <div>
        <div className="event-time">{eventTimeString(this.props.event, this.props.timeFormat)}</div>
        <div className="event-name">{this.props.event.summary}</div>
        <div className="event-user">
          <small>by&nbsp;</small>
          {creator.display_name || creator.email}
        </div>
        <div className="event-location">
          <small>in&nbsp;</small>
          {this.props.event.conference_room.title}
        </div>
      </div>
    );
  }
}
