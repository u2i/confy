import React from 'react';
import { formatDate } from 'helpers/DateHelper';

const CalendarHeader = (props) => (
  <th className="text-center">
    {formatDate(props.day, props.dateFormat)}
  </th>
);

CalendarHeader.propTypes = {
  day:        React.PropTypes.string.isRequired,
  dateFormat: React.PropTypes.string
};

export default CalendarHeader;
