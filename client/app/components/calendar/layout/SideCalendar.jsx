import React from 'react';
import moment from 'moment';
import Calendar from 'rc-calendar';
import bindAll from 'lodash/bindAll';
import 'rc-calendar/assets/index.css';
import './side_calendar.scss';

export default class SideCalendar extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object
  };

  constructor(...args) {
    super(...args);
    this._setMondayAsFirstWeekDay();
    this.state = { value: moment() };

    bindAll(this, ['onSelect', 'onChange']);
  }

  onSelect(date) {
    this._routeToSelectedDate(date);
    this.setState({ value: moment(date) });
  }

  onChange(date) {
    this.setState({ value: moment(date) });
  }

  disableWeekend(date) {
    return date.day() === 0 || date.day() === 6;
  }

  render() {
    return (
      <Calendar value={this.state.value}
                className="side-calendar"
                showDateInput={false}
                disabledDate={this.disableWeekend}
                onSelect={this.onSelect}
                onChange={this.onChange} />
    );
  }

  _setMondayAsFirstWeekDay() {
    moment.updateLocale('en', {
      week: {
        dow: 1
      }
    });
  }

  _routeToSelectedDate(date) {
    const query = `/?date=${date.format('YYYY-MM-DD')}`;
    this.context.router.push(query);
  }
}
