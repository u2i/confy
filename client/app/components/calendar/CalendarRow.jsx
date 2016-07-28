import React from 'react';
import { If } from 'react-if';
import * as DateHelper from 'helpers/DateHelper';
import EventSchema from 'schemas/EventSchema';

import EventWrapper from './event/EventWrapper';

const SECONDS_IN_DAY = 24 * 60 * 60;

const { string, bool, number, arrayOf, oneOfType, instanceOf } = React.PropTypes;

export default class CalendarRow extends React.Component {
  static propTypes = {
    events:          arrayOf(arrayOf(EventSchema.only('start'))).isRequired,
    time:            oneOfType([instanceOf(Date), string]).isRequired,
    days:            arrayOf(oneOfType([instanceOf(Date), string])).isRequired,
    unitEventLength: number,
    timeFormat:      string,
    displayMinutes:  bool
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
    return (event) => DateHelper.timestamp(event.start.date_time) === timestamp;
  }

  _eventGroupContaining(timestamp) {
    return this.props.events.find(group =>
      group.length &&
      Math.abs(group[group.length - 1].start_timestamp - timestamp) < SECONDS_IN_DAY &&
      group.some(event => event.start_timestamp == timestamp)
    );
  }

  _eventsStartingAt(timestamp, group) {
    return group.filter(event => event.start_timestamp == timestamp);
  }

  _displayTime() {
    return new Date(this.props.time).getMinutes() === 0 || this.props.displayMinutes;
  }

  _tableCellNodes() {
    let currentTimeStamp = DateHelper.timestamp(this.props.days[0], this.props.time) - SECONDS_IN_DAY;
    return this.props.days.map(() => {
      currentTimeStamp += SECONDS_IN_DAY;
      let timestamp = currentTimeStamp;
      let eventGroup = this._eventGroupContaining(timestamp) || [];
      let events = this._eventsStartingAt(timestamp, eventGroup);
      let offset = events.length ? eventGroup.indexOf(events[0]) : 0;

      return (
        <td key={timestamp}>
          <EventWrapper timestamp={timestamp}
                        unitEventLength={this.props.unitEventLength}
                        events={events}
                        eventsInGroup={eventGroup.length}
                        offset={offset} />
        </td>
      );
    });
  }
}

const TimeCell = (props) => (
  <td className="text-right time-cell">
    <If condition={props.visible}>
      <small>{DateHelper.formatTime(props.time, props.timeFormat)}</small>
    </If>
  </td>
);

TimeCell.propTypes = {
  time:       oneOfType([instanceOf(Date), string]).isRequired,
  visible:    bool,
  timeFormat: string
};

TimeCell.defaultProps = {
  visible: true
};
