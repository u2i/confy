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
    this.intervalId = setInterval(() => {
      this.forceUpdate();
    }, 60 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    return (
      <tr id="time-indicator-row"><td className="time-cell" />{this._timeIndicatorCells()}</tr>
    );
  }

  _isToday(day) {
    return moment(day).isSame(moment(), 'day');
  }

  _topVal() {
    const minutesFromMidnight = moment().diff(moment().clone().startOf('day'), 'minutes');
    const pixelsPerMinute = parseInt(this.props.rowHeight, 10) / (this.props.unitEventLengthInSeconds / 60);
    const top = minutesFromMidnight * pixelsPerMinute;
    return `${top}px`;
  }

  _timeIndicatorCells() {
    return this.props.days.map(
      (day, ind) => {
        if (this._isToday(day)) {
          return (
            <td key={`IndicatorRow${ind}`} className="has-marker">
              <div id="time-marker" style={{ top: this._topVal() }}></div>
            </td>
          );
        }
        return <td key={`IndicatorRow${ind}`} />;
      }
    );
  }
}
