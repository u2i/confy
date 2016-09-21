import React from 'react';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import { If } from 'react-if';
import DateRangePicker from 'components/shared/time/datepicker/DateRangePicker';
import RequiredFieldLabel from './RequiredFieldLabel';

const { string, func, bool } = React.PropTypes;

const FormDateField = ({ label, onChange, onError, error, start, end, required }) => (
  <FormGroup>
    <RequiredFieldLabel label={label} required={required} />
    <DateRangePicker onChange={onChange}
                     onError={onError}
                     start={start}
                     end={end} />
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
  required: bool
};

export default FormDateField;
