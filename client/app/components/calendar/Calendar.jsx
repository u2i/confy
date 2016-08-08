import React, { PropTypes } from 'react';
import { Table } from 'react-bootstrap';
import * as Immutable from 'immutable';

import RoomFilters from './filters/RoomFilters';
import CalendarRow from './CalendarRow';
import CalendarHeader from './CalendarHeader';

import './calendar.scss';

const { string, number, array, arrayOf, oneOfType, instanceOf, func, object } = PropTypes;

export default class Calendar extends React.Component {
  static propTypes = {
    events:                   array,
    conferenceRooms:          array,
    days:                     arrayOf(oneOfType([instanceOf(Date), string])).isRequired,
    times:                    arrayOf(oneOfType([instanceOf(Date), string])).isRequired,
    unitEventLengthInSeconds: number.isRequired,
    timeFormat:               string,
    dateFormat:               string,
    roomKinds:                object.isRequired,
    onDelete:                 func.isRequired
  };

  static defaultProps = {
    events: []
  };

  constructor(...args) {
    super(...args);
    this.state = { filteredRooms: new Immutable.Set() };

    this._addFilter = this._addFilter.bind(this);
    this._removeFilter = this._removeFilter.bind(this);
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
                   unitEventLengthInSeconds={this.props.unitEventLengthInSeconds}
                   onDelete={this.props.onDelete} />
    ));

    return (
      <div>
        <RoomFilters onEnabled={this._addFilter}
                     onDisabled={this._removeFilter}
                     conferenceRooms={this.props.conferenceRooms}
                     filters={this.state.filteredRooms.toArray()}
                     roomKinds={this.props.roomKinds} />
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

  _addFilter(conferenceRoomId) {
    const filters = this.state.filteredRooms.add(conferenceRoomId);
    this.setState({ filteredRooms: filters });
  }

  _removeFilter(conferenceRoomId) {
    const filters = this.state.filteredRooms.delete(conferenceRoomId);
    this.setState({ filteredRooms: filters });
  }

  _filterEvents() {
    return this.props.events.map((group) => group.filter((event) => !this._eventIsFiltered(event)));
  }

  _eventIsFiltered(event) {
    return this.state.filteredRooms.has(event.conference_room.id);
  }
}

