import React from 'react';
import { instanceOfMoment } from 'proptypes/moment';
import { formatDate, isToday } from 'helpers/DateHelper';
import classNames from 'classnames';

const CalendarHeader = ({ dateFormat, day }) => (
  <th className={classNames('text-center', { 'today-column': isToday(day) })}>
    {formatDate(day, dateFormat)}
  </th>
);

CalendarHeader.propTypes = {
  day:        instanceOfMoment.isRequired,
  dateFormat: React.PropTypes.string
};

export default CalendarHeader;
