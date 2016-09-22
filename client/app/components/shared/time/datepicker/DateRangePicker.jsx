import moment from 'moment';
import React from 'react';
import { roundedTime, addDateAndTime } from 'helpers/DateHelper';
import DateInput from './DateInput';
import TimeInput from './TimeInput';
import instanceOfMoment from 'proptypes/moment';

import './datepicker.scss';

const TIME_STEP_IN_MINUTES = 30;

export default class DateRangePicker extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func,
    onError: React.PropTypes.func,
    startTime: instanceOfMoment,
    endTime: instanceOfMoment
  };

  constructor(...args) {
    super(...args);

    this.handleStartDateChange = (value) => this.handleStartChange(moment(value), this.props.startTime);
    this.handleStartTimeChange = (value) => this.handleStartChange(this.props.startTime, moment(value));
    this.handleEndTimeChange = (value) => this.handleEndChange(this.props.endTime, moment(value));
    this.handleEndDateChange = (value) => this.handleEndChange(moment(value), this.props.endTime);
  }

  shouldComponentUpdate(nextProps) {
    return !moment(nextProps.startTime).isSame(this.props.startTime) ||
           !moment(nextProps.endTime).isSame(this.props.endTime);
  }

  handleStartChange(date, time) {
    const startTime = addDateAndTime(date, time);
    const endTime = this._calculateEnd(startTime);
    this._notifyChange(startTime, endTime);
  }

  handleEndChange(date, time) {
    this.props.onChange({ startTime: this.props.startTime, endTime: addDateAndTime(date, time) });
  }

  handleError(key, error) {
    if (this.props.onError) this.props.onError(key, error);
  }

  render() {
    return (
      <div className="datetimepicker form-inline">
        <DateInput className="start"
                   value={this.props.startTime.toDate()}
                   onChange={this.handleStartDateChange}
                   onError={() => this.handleError('start_time', 'Invalid date')} />
        <TimeInput className="start"
                   value={this.props.startTime.toDate()}
                   onChange={this.handleStartTimeChange}
                   onError={() => this.handleError('start_time', 'Invalid time')}
                   step={TIME_STEP_IN_MINUTES} />
        &nbsp;to&nbsp;
        <TimeInput className="end"
                   value={this.props.endTime.toDate()}
                   onChange={this.handleEndTimeChange}
                   onError={() => this.handleError('end_time', 'Invalid time')}
                   showDuration
                   minTime={this.props.startTime.toDate()}
                   step={TIME_STEP_IN_MINUTES} />
        <DateInput className="end"
                   value={this.props.endTime.toDate()}
                   onChange={this.handleEndDateChange}
                   onError={() => this.handleError('end_time', 'Invalid date')}
                   minDate={this.props.startTime.toDate()} />
      </div>
    );
  }

  _calculateEnd(start) {
    const diff = this.props.endTime.diff(this.props.startTime);
    return start.clone().add(diff, 'ms');
  }

  _notifyChange(startTime, endTime) {
    if (this.props.onChange) {
      this.props.onChange({ startTime, endTime });
    }
  }
}
