import React, { PropTypes } from 'react'
import { Table } from 'react-bootstrap'
import { formatDate } from 'helpers/DateHelper'
import * as Immutable from 'immutable'

import RoomFilters from './RoomFilters'
import CalendarRow from './CalendarRow'


import './calendar.scss';

const { string, number, array, arrayOf, oneOfType, instanceOf } = PropTypes;

const CalendarHeader = (props) => (
  <th className="col-md-2 text-center">
    {formatDate(props.day, props.dateFormat)}
  </th>
);

CalendarHeader.propTypes = {
  day:        string.isRequired,
  dateFormat: string
};

export default class Calendar extends React.Component {
  static propTypes = {
    events:          array,
    conferenceRooms: array,
    days:            arrayOf(oneOfType([instanceOf(Date), string])).isRequired,
    times:           arrayOf(oneOfType([instanceOf(Date), string])).isRequired,
    unitEventLength: number,
    timeFormat:      string,
    dateFormat:      string
  };

  static defaultProps = {
    events: []
  };

    constructor(){
        super();
        this.state = {filteredRooms: new Immutable.Set()}
    }

    _addFilter(conferenceRoomId) {
        let filters = this.state.filteredRooms.add(conferenceRoomId);
        this.setState({filteredRooms: filters});
    }

    _removeFilter(conferenceRoomId) {
        let filters = this.state.filteredRooms.delete(conferenceRoomId);
        this.setState({filteredRooms: filters});
    }

    _filterEvents(){
        return this.props.events.map((group) =>{
            return group.filter((event) => !this._eventIsFiltered(event));
        });
    }

    _eventIsFiltered(event){
        return this.state.filteredRooms.has(event.conference_room.id);
    }

  render() {
    let headerNodes = this.props.days.map(day => (
      <CalendarHeader day={day} dateFormat={this.props.dateFormat} key={day} />
    ));

    let rowNodes = this.props.times.map(time => (
      <CalendarRow time={time}
                   key={time}
                   events={this._filterEvents()}
                   days={this.props.days}
                   unitEventLength={this.props.unitEventLength} />
    ));

    return (
      <div>
        <RoomFilters add={this._addFilter.bind(this)}
                        delete={this._removeFilter.bind(this)}
                        conferenceRooms={this.props.conferenceRooms} />
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
}

