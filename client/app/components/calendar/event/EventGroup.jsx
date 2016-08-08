import React from 'react';
import EventSchema from 'schemas/EventSchema';

import Event from './Event';

import './event_group.scss';

const { number, arrayOf, func } = React.PropTypes;

export default class EventGroup extends React.Component {
  static propTypes = {
    events: arrayOf(EventSchema.only('id')).isRequired,
    timestamp: number.isRequired,
    containerWidth: number.isRequired,
    containerHeight: number.isRequired,
    unitEventLengthInSeconds: number.isRequired,
    onDelete: func.isRequired
  };

  render() {
    let { containerHeight, containerWidth, unitEventLengthInSeconds } = this.props;

    return (
      <div className="event-group">
        {this.props.events.map(event => (
          <Event event={event}
                 containerHeight={containerHeight}
                 containerWidth={containerWidth}
                 unitEventLengthInSeconds={unitEventLengthInSeconds}
                 key={event.id}
                 onDelete={this.props.onDelete} />
        ))}
      </div>
    );
  }
}
