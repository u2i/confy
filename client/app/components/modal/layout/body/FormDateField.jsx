import React from 'react';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import DateTimeField from 'react-bootstrap-datetimepicker';
import { If } from 'react-if';
import 'react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css';

const { string, func, array } = React.PropTypes;

const FormDateField = ({ label, value, dateFormat, onChange, errors }) => (
  <FormGroup>
    <ControlLabel>
      {label}:
    </ControlLabel>
    <DateTimeField
      dateTime={value}
      format={dateFormat}
      inputFormat={dateFormat}
      onChange={onChange} />
    <If condition={errors !== undefined}>
      <div className="text-danger">{errors[0]}</div>
    </If>
  </FormGroup>
);

FormDateField.propTypes = {
  dateFormat: string.isRequired,
  label: string.isRequired,
  onChange: func.isRequired,
  errors: array
};

FormDateField.defaultProps = {
  errors: []
};

export default FormDateField;
