import React from 'react';
import instanceOfMoment from 'proptypes/moment';
import { formatDate } from 'helpers/DateHelper';

const CalendarHeader = (props) => (
  <th className="text-center">
    {formatDate(props.day, props.dateFormat)}
  </th>
);

CalendarHeader.propTypes = {
  day:        instanceOfMoment.isRequired,
  dateFormat: React.PropTypes.string
};

export default CalendarHeader;
