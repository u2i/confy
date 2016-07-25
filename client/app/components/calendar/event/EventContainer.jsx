import React from 'react'
import { timestamp } from 'helpers/DateHelper'

import Event from './Event'

import './event_container.scss'

export default class EventContainer extends React.Component {
  static propTypes = {
    events:          React.PropTypes.array.isRequired,
    eventsInGroup:   React.PropTypes.number.isRequired,
    offset:          React.PropTypes.number.isRequired,
    timestamp:       React.PropTypes.number.isRequired,
    containerWidth:  React.PropTypes.number.isRequired,
    containerHeight: React.PropTypes.number.isRequired,
    unitEventLength: React.PropTypes.number
  };

  render() {
    let { containerHeight, unitEventLength } = this.props;

    let eventNodes = this.props.events.map(event =>
      <Event event={event}
             containerHeight={containerHeight}
             unitEventLength={unitEventLength}
             key={event.id} />
    );

    return <div className="event-container" style={this._containerStyle()}>{eventNodes}</div>;
  }

  _eventWidth() {
    return this.props.eventsInGroup != 0 ? this.props.containerWidth / this.props.eventsInGroup : 0;
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
    }
  }
}
