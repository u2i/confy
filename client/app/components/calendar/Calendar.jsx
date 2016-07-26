import React, { PropTypes } from 'react'
import { Col, Table } from 'react-bootstrap'
import { formatDate, formatTime } from 'helpers/DateHelper'
import  RoomsContainer from './RoomsContainer'
import CalendarRow from './CalendarRow'

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
        this.state = {filtered_rooms: []}
    }

    _onChange(conference_room_id) {
        let new_filter = this.state.filtered_rooms.concat(conference_room_id);
        this.setState({filtered_rooms: new_filter})
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
            <RoomsContainer changing={this._onChange.bind(this)}/>
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

