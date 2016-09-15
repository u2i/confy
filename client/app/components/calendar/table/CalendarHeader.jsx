import React from 'react';
import instanceOfMoment from 'proptypes/moment';
import { formatDate, isToday } from 'helpers/DateHelper';
import classNames from 'classnames';

const CalendarHeader = ({ dateFormat, selected, day }) => (
  <th className={classNames('text-center', { 'today-column': isToday(day), 'selected-day': selected })}>
    {formatDate(day, dateFormat)}
  </th>
);

CalendarHeader.propTypes = {
  day:        instanceOfMoment.isRequired,
  dateFormat: React.PropTypes.string
};

export default CalendarHeader;
