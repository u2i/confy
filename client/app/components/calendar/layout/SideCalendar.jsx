import React from 'react';
import moment from 'moment';
import Calendar from 'rc-calendar';
import bindAll from 'lodash/bindAll';
import { instanceOfMoment } from 'proptypes/moment';
import 'rc-calendar/assets/index.css';
import './side_calendar.scss';

const isWeekend = (date) => date.day() === 0 || date.day() === 6;

export default class SideCalendar extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object
  };

  static propTypes = {
    date: instanceOfMoment.isRequired
  };

  constructor(...args) {
    super(...args);
    this.state = { value: moment(this.props.date) };

    bindAll(this, ['onSelect', 'updateSelectedDate']);
  }

  onSelect(date) {
    this._routeToSelectedDate(date);
    this.updateSelectedDate(date);
  }

  updateSelectedDate(date) {
    this.setState({ value: moment(date) });
  }

  render() {
    return (
      <Calendar value={this.state.value}
                className="side-calendar"
                showDateInput={false}
                disabledDate={isWeekend}
                onSelect={this.onSelect}
                onChange={this.updateSelectedDate} />
    );
  }

  _routeToSelectedDate(date) {
    const query = `/?date=${date.format('YYYY-MM-DD')}`;
    this.context.router.push(query);
  }
}
