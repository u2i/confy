import React, { PropTypes } from 'react'
import { formatTime, timestamp } from 'helpers/dateHelper'

import EventGroup from './event/EventGroup'

export default class CalendarRow extends React.Component {
  static propTypes = {
    events: PropTypes.array.isRequired,
    time: PropTypes.string.isRequired,
    days: PropTypes.arrayOf(PropTypes.string).isRequired,
    timeFormat: PropTypes.string,
    displayMinutes: PropTypes.bool
  };

  static defaultProps = {
    timeFormat: 'Ha',
    displayMinutes: false
  };

  render() {
    let timeStr = formatTime(this.props.time, this.props.timeFormat);

    return (
      <tr>
        <td className="text-right">
          <small>{this._displayTime() ? timeStr : ''}</small>
        </td>
        {this._tableCellNodes()}
      </tr>
    )
  }

  _displayTime() {
    return new Date(this.props.time).getMinutes() === 0 || this.props.displayMinutes;
  }

  _tableCellNodes() {
    return this.props.days.map(day => {
      let tmstmp = timestamp(day, this.props.time);
      let events = this.props.events.find(group =>
        group.some(event => timestamp(event.start_time) === tmstmp));

      return (
        <td key={tmstmp}>
          { events ? <EventGroup date={day} time={this.props.time} events={events} /> : ''}
        </td>
      );
    })
  }
}

