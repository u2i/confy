import React  from 'react'
import * as DateHelper from 'helpers/DateHelper'
import EventSchema from 'schemas/EventSchema'
import EventWrapper from './event/EventDimensions'
import * as Immutable from 'immutable'

const SECONDS_IN_DAY = 24 * 60 * 60;

const { string, bool, number, array, arrayOf, oneOfType, instanceOf } = React.PropTypes;

const TimeCell = (props) => (
  <td className="text-right time-cell">
    <small>{props.visible ? DateHelper.formatTime(props.time, props.timeFormat) : ''}</small>
  </td>
);

export default class CalendarRow extends React.Component {
  static propTypes = {
    events:          arrayOf(arrayOf(EventSchema.only('start'))).isRequired,
    filtered_rooms:  instanceOf(Immutable.Set),
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

  _eventIsFiltered(event){
    return this.props.filtered_rooms.has(event.conference_room.id);
  }

  _eventGroupContaining(timestamp) {
    var group = this.props.events.find(group =>
      group.some(event => event.timestamp == timestamp && !this._eventIsFiltered(event))
    );
    if(group) return group.filter(event => !this._eventIsFiltered(event))
    return group
  }

  _eventsStartingAt(timestamp, group) {
    return group.filter(event => event.timestamp == timestamp && !this._eventIsFiltered(event));
  }

  _displayTime() {
    return new Date(this.props.time).getMinutes() === 0 || this.props.displayMinutes;
  }

  _tableCellNodes() {
    let current_time_stamp = DateHelper.timestamp(this.props.days[0], this.props.time) - SECONDS_IN_DAY;
    return this.props.days.map(day => {
      current_time_stamp += SECONDS_IN_DAY;
      let timestamp = current_time_stamp;
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
    })
  }
}

