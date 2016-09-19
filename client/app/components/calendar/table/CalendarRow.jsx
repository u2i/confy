import React from 'react';
import { instanceOfMoment } from 'proptypes/moment';
import * as DateHelper from 'helpers/DateHelper';
import EventSchema from 'schemas/EventSchema';
import TimeCell from './TimeCell';
import EventWrapper from '../event/EventWrapper';
import { SECONDS_IN_DAY, eventGroupContaining, eventsStartingAt } from 'helpers/EventHelper';

const { string, bool, number, arrayOf, func } = React.PropTypes;

export default class CalendarRow extends React.Component {
  static propTypes = {
    events: arrayOf(EventSchema.only('start_timestamp')).isRequired,
    time: instanceOfMoment.isRequired,
    days: arrayOf(instanceOfMoment).isRequired,
    unitEventLengthInSeconds: number.isRequired,
    timeFormat: string,
    displayMinutes: bool,
    onDelete: func.isRequired
  };

  static defaultProps = {
    timeFormat: 'Ha',
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

  _displayTime() {
    return new Date(this.props.time).getMinutes() === 0 || this.props.displayMinutes;
  }

  _tableCellNodes() {
    let currentTimeStamp = DateHelper.timestamp(this.props.days[0], this.props.time) - SECONDS_IN_DAY;
    return this.props.days.map(() => {
      currentTimeStamp += SECONDS_IN_DAY;
      let timestamp = currentTimeStamp;
      let events = this.props.events ? eventsStartingAt(timestamp, this.props.events) : [];

      return (
        <EventWrapper timestamp={timestamp}
                      unitEventLengthInSeconds={this.props.unitEventLengthInSeconds}
                      events={events}
                      key={timestamp}
                      onDelete={this.props.onDelete} />
      );
    });
  }
}
