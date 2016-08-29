import React from 'react';
import instanceOfMoment from 'proptypes/moment';
import { formatDate, isToday } from 'helpers/DateHelper';
import classNames from 'classnames';

export default class CalendarHeader extends React.Component {
  static propTypes = {
    day:        instanceOfMoment.isRequired,
    dateFormat: React.PropTypes.string
  };

  render() {
    const headerClassNames = classNames('text-center', { 'today-column': isToday(this.props.day) });
    return (
      <th className={headerClassNames}>
        {formatDate(this.props.day, this.props.dateFormat)}
      </th>
    );
  }
}
