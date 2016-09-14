import moment from 'moment';
import React from 'react';
import { FormGroup } from 'react-bootstrap';
import { roundedTime } from 'helpers/DateHelper';
import DateInput from './DateInput';
import TimeInput from './TimeInput';

import './datepicker.scss';

export default class DateRangePicker extends React.Component {
  componentDidMount() {
    new Datepair($(this.fieldGroup)[0]);
  }

  render() {
    return (
      <div className="datetimepicker form-inline" ref={ref => this.fieldGroup = ref}>
        <DateInput className="start" />
        <TimeInput className="start" initialDate={roundedTime(moment())} />
        &nbsp;to&nbsp;
        <TimeInput className="end" />
        <DateInput className="end" />
      </div>
    );
  }
}
