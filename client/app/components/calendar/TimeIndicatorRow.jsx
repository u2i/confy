import React from 'react';
import moment from 'moment';
import instanceOfMoment from 'proptypes/moment';
import style from './calendar.scss';
import { v4 as uuid } from 'node-uuid';

export default class TimeIndicatorRow extends React.Component {
  static propTypes = {
    days:                     React.PropTypes.arrayOf(instanceOfMoment).isRequired,
    unitEventLengthInSeconds: React.PropTypes.number.isRequired,
    rowHeight:                React.PropTypes.string
  };
  static defaultProps = {
    rowHeight: style.rowHeight
  };

  componentDidMount() {
    setInterval(() => {
      this.forceUpdate();
    }, 60 * 1000);
  }

  render() {
    const timeIndicatorCells = this.props.days.map(
      day => this._isToday(day)
        ? <td key={uuid()} className="has-marker"><div id="time-marker" style={{ top: this._topVal() }}></div></td>
        : <td key={uuid()} />
    );
    return (
      <tr id="time-indicator-row"><td className="time-cell" />{timeIndicatorCells}</tr>
    );
  }

  _isToday(day) {
    return moment(day).isSame(moment(), 'day');
  }

  _topVal() {
    const minutesFromMidnight = moment().diff(moment().clone().startOf('day'), 'minutes');
    const top = minutesFromMidnight * parseInt(this.props.rowHeight, 10) / (this.props.unitEventLengthInSeconds / 60);
    return `${top}px`;
  }
}
