import React from 'react';
import * as DateHelper from 'helpers/DateHelper';
import EventSchema from 'schemas/EventSchema';

import TimeCell from './TimeCell';
import EventWrapper from './event/EventWrapper';

const SECONDS_IN_DAY = 24 * 60 * 60;

const { string, bool, number, arrayOf, oneOfType, instanceOf, func } = React.PropTypes;

export default class CalendarRow extends React.Component {
  static propTypes = {
    events:                   arrayOf(arrayOf(EventSchema.only('start'))).isRequired,
    time:                     oneOfType([instanceOf(Date), string]).isRequired,
    days:                     arrayOf(oneOfType([instanceOf(Date), string])).isRequired,
    unitEventLengthInSeconds: number.isRequired,
    timeFormat:               string,
    displayMinutes:           bool,
    onDelete:                 func.isRequired
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
    );
  }

  _eventStartsAt(timestamp) {
    return (event) => event.start_timestamp === timestamp;
  }

  _groupInDay(group, timestamp) {
    return Math.abs(group[group.length - 1].start_timestamp - timestamp) < SECONDS_IN_DAY;
  }

  _eventGroupContaining(timestamp) {
    return this.props.events.find(group =>
      group.length &&
      this._groupInDay(group, timestamp) &&
      group.some(this._eventStartsAt(timestamp))
    );
  }

  _eventsStartingAt(timestamp, group) {
    return group.filter(this._eventStartsAt(timestamp));
  }

  _displayTime() {
    return new Date(this.props.time).getMinutes() === 0 || this.props.displayMinutes;
  }

  _tableCellNodes() {
    let currentTimeStamp = DateHelper.timestamp(this.props.days[0], this.props.time) - SECONDS_IN_DAY;
    return this.props.days.map(() => {
      currentTimeStamp += SECONDS_IN_DAY;
      let timestamp = currentTimeStamp;
      const eventGroup = this._eventGroupContaining(timestamp) || [];
      let events = this._eventsStartingAt(timestamp, eventGroup);
      let offset = events.length ? eventGroup.indexOf(events[0]) : 0;

      return (
        <EventWrapper timestamp={timestamp}
                      unitEventLengthInSeconds={this.props.unitEventLengthInSeconds}
                      events={events}
                      eventsInGroup={eventGroup.length}
                      offset={offset}
                      key={timestamp}
                      onDelete={this.props.onDelete} />
      );
    });
  }
}
