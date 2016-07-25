import React, { PropTypes } from 'react'
const {string, bool, array, arrayOf, oneOfType, instanceOf} = PropTypes;

import * as DateHelper from 'helpers/dateHelper'

import EventGroup from './event/EventGroup'

const TimeCell = (props) => (
  <td className="text-right">
    <small>{props.visible ? DateHelper.formatTime(props.time, props.timeFormat) : ''}</small>
  </td>
);

export default class CalendarRow extends React.Component {
  static propTypes = {
    events:         array.isRequired,
    time:           oneOfType([instanceOf(Date), string]).isRequired,
    days:           arrayOf(oneOfType([instanceOf(Date), string])).isRequired,
    timeFormat:     string,
    displayMinutes: bool
  };

  static defaultProps = {
    timeFormat:     'Ha',
    displayMinutes: false
  };

  render() {
    return (
      <tr>
        <TimeCell visible={this._displayTime()}
                  time={this.props.time}
                  timeFormat={this.props.timeFormat} />
        {this._tableCellNodes()}
      </tr>
    )
  }

  _eventsStartingAt(timestamp) {
    return this.props.events.find(group =>
      group.some(event => DateHelper.timestamp(event.start_time) == timestamp)
    );
  }

  _displayTime() {
    return new Date(this.props.time).getMinutes() === 0 || this.props.displayMinutes;
  }

  _tableCellNodes() {
    return this.props.days.map(day => {
      let timestamp = DateHelper.timestamp(day, this.props.time);
      let events = this._eventsStartingAt(timestamp);

      return (
        <td key={timestamp}>
          { events ? <EventGroup date={day} time={this.props.time} events={events} /> : '' }
        </td>
      );
    })
  }
}

