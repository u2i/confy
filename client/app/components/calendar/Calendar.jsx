import React, { PropTypes } from 'react';
import { Table } from 'react-bootstrap';
import { formatDate } from 'helpers/DateHelper';

import CalendarRow from './CalendarRow';

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
    days:            arrayOf(oneOfType([instanceOf(Date), string])).isRequired,
    times:           arrayOf(oneOfType([instanceOf(Date), string])).isRequired,
    unitEventLength: number,
    timeFormat:      string,
    dateFormat:      string
  };

  static defaultProps = {
    events: []
  };

  render() {
    let headerNodes = this.props.days.map(day => (
      <CalendarHeader day={day} dateFormat={this.props.dateFormat} key={day} />
    ));

    let rowNodes = this.props.times.map(time => (
      <CalendarRow time={time}
                   key={time}
                   {...this.props} />
    ));

    return (
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
    );
  }
}

