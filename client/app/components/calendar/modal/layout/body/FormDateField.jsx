import React from 'react';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import { If } from 'react-if';
import DateRangePicker from 'components/shared/time/datepicker/DateRangePicker';

const { string, func, array, bool } = React.PropTypes;

const FormDateField = ({ label, value, onChange, errors, required }) => (
  <FormGroup>
    <ControlLabel>
      {label}:{required ? '*' : ''}
    </ControlLabel>
    <DateRangePicker />
    <If condition={errors !== undefined}>
      <div className="text-danger">{errors[0]}</div>
    </If>
  </FormGroup>
);

FormDateField.propTypes = {
  label: string.isRequired,
  value: string.isRequired,
  onChange: func.isRequired,
  errors: array,
  required: bool
};

FormDateField.defaultProps = {
  errors: []
};

export default FormDateField;
