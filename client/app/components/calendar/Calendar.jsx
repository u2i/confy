import React, { PropTypes } from 'react'
import { Col, Table } from 'react-bootstrap'
import { formatDate, formatTime } from 'helpers/DateHelper'
import  RoomsContainer from './RoomsContainer'
import CalendarRow from './CalendarRow'
import * as Immutable from 'immutable'

import './calendar.scss'

const { string, number, array, arrayOf, oneOfType, instanceOf } = PropTypes;

const CalendarHeader = (props) => (
  <th className="col-md-2 text-center">
    {formatDate(props.day, props.dateFormat)}
  </th>
);

export default class Calendar extends React.Component {
  static propTypes = {
    events:          array,
    conference_rooms: array,
    days:            arrayOf(oneOfType([instanceOf(Date), string])).isRequired,
    times:           arrayOf(oneOfType([instanceOf(Date), string])).isRequired,
    unitEventLenght: number,
    timeFormat:      string,
    dateFormat:      string
  };

  static defaultProps = {
    events: []
  };
    
    constructor(){
        super();
        this.state = {filtered_rooms: new Immutable.Set()}
    }

    _addFilter(conference_room_id) {
        let filters = this.state.filtered_rooms.add(conference_room_id);
        this.setState({filtered_rooms: filters});
    }

    _removeFilter(conference_room_id) {
        let filters = this.state.filtered_rooms.delete(conference_room_id);
        this.setState({filtered_rooms: filters});
    }

  render() {
    let headerNodes = this.props.days.map(day => (
      <CalendarHeader day={day} dateFormat={this.props.date_format} key={day} />
    ));

    let rowNodes = this.props.times.map(time => (
      <CalendarRow time={time}
                   key={time}
                   filtered_rooms={this.state.filtered_rooms}
                   {...this.props} />
    ));

    return (
        <div>
            <RoomsContainer add={this._addFilter.bind(this)} delete={this._removeFilter.bind(this)} conferenceRooms={this.props.conference_rooms}/>
            <Table bordered striped responsive className="calendar">
                <thead>
                <tr>
                    <th className="col-md-1" />
                    {headerNodes}
                </tr>
                </thead>
                <tbody>
                {rowNodes}
                </tbody>
            </Table>
        </div>
    );
  }
};

