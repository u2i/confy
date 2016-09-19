import React from 'react';
import { If } from 'react-if';
import { instanceOfMoment } from 'proptypes/moment';
import style from './calendar.scss';
import { isToday, minutesFromMidnight } from 'helpers/DateHelper';


export default class TimeIndicatorRow extends React.Component {
  static propTypes = {
    days:                     React.PropTypes.arrayOf(instanceOfMoment).isRequired,
    unitEventLengthInSeconds: React.PropTypes.number.isRequired
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

  _topVal() {
    const pixelsPerMinute = parseInt(style.rowHeight, 10) / (this.props.unitEventLengthInSeconds / 60);
    const top = minutesFromMidnight() * pixelsPerMinute;
    return `${top}px`;
  }

  _timeIndicatorCells() {
    return this.props.days.map(
    (day, ind) => {
      const today = isToday(day);
      return (
        <td className={today ? 'has-marker' : ''} key={`IndicatorRow${ind}`}>
          <If condition={today}>
            <div id="time-marker" style={{ top: this._topVal() }}></div>
          </If>
        </td>
      );
    });
  }
}
