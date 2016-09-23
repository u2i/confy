import React from 'react';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import { If } from 'react-if';
import DateRangePicker from 'components/shared/time/datepicker/DateRangePicker';
import RequiredFieldLabel from './RequiredFieldLabel';
import instanceOfMoment from 'proptypes/moment';

const { string, func, bool } = React.PropTypes;

const FormDateField = ({ label, onChange, onError, error, startTime, endTime, required }) => (
  <FormGroup>
    <RequiredFieldLabel label={label} required={required} />
    <DateRangePicker onChange={onChange}
                     onError={onError}
                     startTime={startTime}
                     endTime={endTime} />
    <If condition={typeof error !== 'undefined'}>
      <div className="text-danger">{error}</div>
    </If>
  </FormGroup>
);

FormDateField.propTypes = {
  label: string.isRequired,
  onChange: func,
  onError: func,
  error: string,
  required: bool,
  startTime: instanceOfMoment,
  endTime: instanceOfMoment
};

export default FormDateField;
