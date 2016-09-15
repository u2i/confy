import { Map } from 'immutable';
import moment from 'moment';
import flow from 'lodash/fp/flow';
import keys from 'lodash/fp/keys';
import map from 'lodash/fp/map';
import find from 'lodash/fp/find';
import ReactDOM from 'react-dom';
import React, { PropTypes } from 'react';
import instanceOfMoment from 'proptypes/moment';
import { Table } from 'react-bootstrap';
import { loadFilters, saveFilters } from 'helpers/FiltersHelper';
import EventSchema from 'schemas/EventSchema';
import { setEventsPositionAttributes } from 'helpers/EventHelper';
import RoomFilters from '../filters/RoomFilters';
import CalendarRow from './CalendarRow';
import CalendarHeader from './CalendarHeader';
import TimeIndicatorRow from './TimeIndicatorRow';

import './calendar.scss';

const { string, number, shape, array, arrayOf, func, object } = PropTypes;

export default class Calendar extends React.Component {
  static propTypes = {
    events: arrayOf(EventSchema.only('start_timestamp', 'end_timestamp', 'conference_room')).isRequired,
    conferenceRooms: array,
    days: arrayOf(instanceOfMoment).isRequired,
    times: arrayOf(instanceOfMoment).isRequired,
    unitEventLengthInSeconds: number.isRequired,
    timeFormat: string,
    dateFormat: string,
    roomKinds: object.isRequired,
    onDelete: func.isRequired,
    scrollTo: shape({ hours: number, minutes: number }),
    onCellClick: func
  };

  static defaultProps = {
    events: [],
    scrollTo: { hours: 0, minutes: 0 }
  };

  constructor(...args) {
    super(...args);
    this.state = { filteredRooms: loadFilters(this.props.conferenceRooms) };
    this.rows = {};

    this.handleFilterToggle = this.handleFilterToggle.bind(this);
    this.handleToggleAllFilters = this.handleToggleAllFilters.bind(this);
  }

  componentDidMount() {
    this._scrollToRow();
  }

  handleFilterToggle(conferenceRoomId) {
    const value = this.state.filteredRooms.get(conferenceRoomId);
    this.setState({ filteredRooms: this.state.filteredRooms.set(conferenceRoomId, !value) },
      () => saveFilters(this.state.filteredRooms)
    );
  }

  handleToggleAllFilters() {
    const value = this.state.filteredRooms.some(val => !val);
    this.setState({ filteredRooms: new Map(this.props.conferenceRooms.map(room => [room.id, value])) },
      () => saveFilters(this.state.filteredRooms)
    );
  }

  render() {
    let headerNodes = this.props.days.map(day => (
      <CalendarHeader day={day} dateFormat={this.props.dateFormat} key={day} />
    ));

    const filteredEvents = this._filterEvents();
    setEventsPositionAttributes(filteredEvents);
    let rowNodes = this.props.times.map(time => (
      <CalendarRow time={time}
                   key={time}
                   events={filteredEvents}
                   days={this.props.days}
                   unitEventLengthInSeconds={this.props.unitEventLengthInSeconds}
                   onDelete={this.props.onDelete}
                   ref={(ref) => this.rows[time.unix()] = ref}
                   onCellClick={this.props.onCellClick} />
    ));

    return (
      <div>
        <RoomFilters onFilterToggle={this.handleFilterToggle}
                     onToggleAll={this.handleToggleAllFilters}
                     conferenceRooms={this.props.conferenceRooms}
                     filters={this.state.filteredRooms}
                     roomKinds={this.props.roomKinds} />
        <Table bordered striped responsive className="calendar">
          <thead>
            <tr>
              <th className="time-cell" />
              {headerNodes}
            </tr>
          </thead>
          <tbody>
            <TimeIndicatorRow
              days={this.props.days}
              unitEventLengthInSeconds={this.props.unitEventLengthInSeconds} />
            {rowNodes}
          </tbody>
        </Table>
      </div>
    );
  }


  _filterEvents() {
    return this.props.events.filter((event) => this._eventVisible(event));
  }

  _eventVisible(event) {
    return this.state.filteredRooms.get(event.conference_room.id);
  }

  _findRow(hours, minutes) {
    const time = flow(
      keys,
      map(t => moment.unix(t)),
      find(t => t.hours() === hours && t.minutes() === minutes)
    )(this.rows);

    return this.rows[time.unix()];
  }

  _scrollToRow() {
    const { hours, minutes } = this.props.scrollTo;
    const node = ReactDOM.findDOMNode(this._findRow(hours, minutes));
    if (node.scrollIntoView) {
      node.scrollIntoView();
    }
  }
}
