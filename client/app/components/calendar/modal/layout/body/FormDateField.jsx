import React from 'react';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import { If } from 'react-if';
import DateRangePicker from 'components/shared/time/datepicker/DateRangePicker';

const { string, func, array } = React.PropTypes;

const FormDateField = ({ label, value, dateFormat, onChange, errors }) => (
  <FormGroup>
    <ControlLabel>
      {label}:
    </ControlLabel>
    <DateRangePicker />
    <If condition={errors !== undefined}>
      <div className="text-danger">{errors[0]}</div>
    </If>
  </FormGroup>
);

FormDateField.propTypes = {
  dateFormat: string.isRequired,
  label: string.isRequired,
  value: string.isRequired,
  onChange: func.isRequired,
  errors: array
};

FormDateField.defaultProps = {
  errors: []
};

export default FormDateField;
