import React from 'react';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import { If } from 'react-if';
import DateRangePicker from 'components/shared/time/datepicker/DateRangePicker';
import RequiredFieldLabel from './RequiredFieldLabel';

const { string, func, array, bool } = React.PropTypes;

const FormDateField = ({ label, onChange, onError, errors, required }) => (
  <FormGroup>
    <RequiredFieldLabel label={label} required={required} />
    <DateRangePicker onChange={onChange} onError={onError} errors={errors} />
    <If condition={errors != null}>
      <div className="text-danger">{errors[0]}</div>
    </If>
  </FormGroup>
);

FormDateField.propTypes = {
  label: string.isRequired,
  onChange: func,
  onError: func,
  errors: array,
  required: bool
};

FormDateField.defaultProps = {
  errors: []
};

export default FormDateField;
