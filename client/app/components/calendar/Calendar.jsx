import React from 'react'
import Event from './event/Event'

export default class Calendar extends React.Component {
  render() {
    return (
      <div></div>
    );
  }
}

Calendar.propTypes = {
  events: React.PropTypes.array.required
};
