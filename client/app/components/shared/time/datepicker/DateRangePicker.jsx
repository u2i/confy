import moment from 'moment';
import React from 'react';
import { roundedTime, addDateAndTime } from 'helpers/DateHelper';
import DateInput from './DateInput';
import TimeInput from './TimeInput';

import './datepicker.scss';

const TIME_STEP_IN_MINUTES = 30;

export default class DateRangePicker extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func,
    onError: React.PropTypes.func
  };

  constructor(...args) {
    super(...args);

    this.handleStartDateChange = (value) => this.handleStartChange(moment(value), this.props.start);
    this.handleStartTimeChange = (value) => this.handleStartChange(this.props.start, moment(value));
    this.handleEndTimeChange = (value) => this.handleEndChange(this.props.end, moment(value));
    this.handleEndDateChange = (value) => this.handleEndChange(moment(value), this.props.end);
  }

  shouldComponentUpdate(nextProps) {
    return !moment(nextProps.start).isSame(this.props.start) || !moment(nextProps.end).isSame(this.props.end);
  }

  handleStartChange(date, time) {
    const start = addDateAndTime(date, time);
    const end = this._calculateEnd(start);
    this._notifyChange(start, end);
  }

  handleEndChange(date, time) {
    this.props.onChange({ startTime: this.props.start, endTime: addDateAndTime(date, time) });
  }

  handleError(key, error) {
    if (this.props.onError) this.props.onError(key, error);
  }

  render() {
    return (
      <div className="datetimepicker form-inline">
        <DateInput className="start"
                   value={this.props.start.toDate()}
                   onChange={this.handleStartDateChange}
                   onError={() => this.handleError('start_time', 'Invalid date')} />
        <TimeInput className="start"
                   value={this.props.start.toDate()}
                   onChange={this.handleStartTimeChange}
                   onError={() => this.handleError('start_time', 'Invalid time')}
                   step={TIME_STEP_IN_MINUTES} />
        &nbsp;to&nbsp;
        <TimeInput className="end"
                   value={this.props.end.toDate()}
                   onChange={this.handleEndTimeChange}
                   onError={() => this.handleError('end_time', 'Invalid time')}
                   showDuration
                   minTime={this.props.start.toDate()}
                   step={TIME_STEP_IN_MINUTES} />
        <DateInput className="end"
                   value={this.props.end.toDate()}
                   onChange={this.handleEndDateChange}
                   onError={() => this.handleError('end_time', 'Invalid date')}
                   minDate={this.props.start.toDate()} />
      </div>
    );
  }

  _calculateEnd(start) {
    const diff = this.props.end.diff(this.props.start);
    return start.clone().add(diff, 'ms');
  }

  _notifyChange(start, end) {
    if (this.props.onChange) {
      this.props.onChange({ startTime: start, endTime: end });
    }
  }
}
