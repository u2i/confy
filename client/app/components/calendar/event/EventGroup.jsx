import React from 'react'

import Event from './Event'

import './event_group.scss'

export default class EventGroup extends React.Component {
  static propTypes = {
    events: React.PropTypes.array.isRequired
  };
  
  render() {
    let eventNodes = this.props.events.map(event => (
      <Event event={event} key={event.id} />
    ));
  
    return <div className="event-container">{eventNodes}</div>;
  }
}
