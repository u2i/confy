import React from 'react';
import moment from 'moment';
import Calendar from 'rc-calendar';
import { browserHistory } from 'react-router';
import 'rc-calendar/assets/index.css';
import './side_calendar.scss';

export default class SideCalendar extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object
  };

  constructor(...args) {
    super(...args);
    moment.updateLocale('en', {
      week: {
        dow: 1
      }
    });

    this.state = { value: moment() };
  }

  disableWeekend(date) {
    return date.day() == 0 || date.day() == 6;
  }

  onSelect(date) {
    this.context.router.push(`/?date=${date.format('YYYY-MM-DD')}`);
    this.setState({ value: moment(date) });
  }

  onChange(date) {
    this.setState({ value: moment(date) });
  }

  render() {
    return (
      <Calendar value={this.state.value}
                className="side-calendar"
                showDateInput={false}
                disabledDate={this.disableWeekend}
                onSelect={this.onSelect.bind(this)}
                onChange={this.onChange.bind(this)}
      />
    );
  }
}
