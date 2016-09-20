import React from 'react';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import { If } from 'react-if';
import DateRangePicker from 'components/shared/time/datepicker/DateRangePicker';

const { string, func, array, bool } = React.PropTypes;

const FormDateField = ({ label, onChange, onError, errors, required }) => (
  <FormGroup>
    <ControlLabel>
      {label}:{required ? '*' : ''}
    </ControlLabel>
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
