import React from 'react';
import EventSchema from 'schemas/EventSchema';

import Event from './Event';

import './event_group.scss';

const { number, arrayOf, func } = React.PropTypes;

export default class EventGroup extends React.Component {
  static propTypes = {
    events:                   arrayOf(EventSchema.only('id')).isRequired,
    eventsInGroup:            number.isRequired,
    offset:                   number.isRequired,
    timestamp:                number.isRequired,
    containerWidth:           number.isRequired,
    containerHeight:          number.isRequired,
    unitEventLengthInSeconds: number.isRequired,
    onDelete:                 func.isRequired
  };

  render() {
    let { containerHeight, unitEventLengthInSeconds } = this.props;

    let eventNodes = this.props.events.map(event =>
      <Event event={event}
             containerHeight={containerHeight}
             unitEventLengthInSeconds={unitEventLengthInSeconds}
             key={`${event.id}_${event.conference_room.id}`}
             onDelete={this.props.onDelete} />
    );

    return <div className="event-group" style={this._containerStyle()}>{eventNodes}</div>;
  }

  _eventWidth() {
    return this.props.eventsInGroup !== 0 ? this.props.containerWidth / this.props.eventsInGroup : 0;
  }

  _containerWidth() {
    return this._eventWidth() * this.props.events.length;
  }

  _containerOffset() {
    return this._eventWidth() * this.props.offset;
  }

  _containerStyle() {
    return {
      width:      this._containerWidth(),
      marginLeft: this._containerOffset()
    };
  }
}
