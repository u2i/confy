import moment from 'moment';
import React from 'react';
import { roundedTime, addDateAndTime } from 'helpers/DateHelper';
import DateInput from './DateInput';
import TimeInput from './TimeInput';

import './datepicker.scss';

const TIME_STEP_IN_SECONDS = 30 * 60;
const INITIAL_TIME = roundedTime(moment(), TIME_STEP_IN_SECONDS);
const INITIAL_STATE = {
  start: INITIAL_TIME,
  end: INITIAL_TIME.clone().add(1, 'hour')
};

export default class DateRangePicker extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func
  };

  constructor(...args) {
    super(...args);

    this.state = INITIAL_STATE;
    this.handleStartDateChange = (value) => this.handleStartChange(moment(value), this.state.start);
    this.handleStartTimeChange = (value) => this.handleStartChange(this.state.start, moment(value));
    this.handleEndTimeChange = (value) => this.handleEndChange(this.state.end, moment(value));
    this.handleEndDateChange = (value) => this.handleEndChange(moment(value), this.state.end);
  }

  componentDidMount() {
    this._notifyChange();
  }

  componentDidUpdate(_prevProps, prevState) {
    if (!prevState.start.isSame(this.state.start) || !prevState.end.isSame(this.state.end)) {
      this._notifyChange();
    }
  }

  handleStartChange(date, time) {
    const start = addDateAndTime(date, time);
    const end = this._calculateEnd(start);
    this.setState({ start, end });
  }

  handleEndChange(date, time) {
    this.setState({ end: addDateAndTime(date, time) });
  }

  render() {
    return (
      <div className="datetimepicker form-inline">
        <DateInput className="start"
                   value={this.state.start.toDate()}
                   onChange={this.handleStartDateChange}
                   minDate={this.state.start.toDate()} />
        <TimeInput className="start"
                   value={this.state.start.toDate()}
                   onChange={this.handleStartTimeChange}
                   step={TIME_STEP_IN_SECONDS / 60} />
        &nbsp;to&nbsp;
        <TimeInput className="end"
                   value={this.state.end.toDate()}
                   onChange={this.handleEndTimeChange}
                   showDuration
                   minTime={this.state.start.toDate()}
                   step={TIME_STEP_IN_SECONDS / 60} />
        <DateInput className="end"
                   value={this.state.end.toDate()}
                   onChange={this.handleEndDateChange}
                   minDate={this.state.start.toDate()} />
      </div>
    );
  }

  _calculateEnd(start) {
    const diff = this.state.end.diff(this.state.start);
    return start.clone().add(diff, 'ms');
  }

  _notifyChange() {
    if (this.props.onChange) {
      this.props.onChange({ start: this.state.start.format(), end: this.state.end.format() });
    }
  }
}
