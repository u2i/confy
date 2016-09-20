import React from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import RequiredFieldLabel from './RequiredFieldLabel';
import capitalize from 'lodash/capitalize';

const { string, func, bool } = React.PropTypes;

const FormTextField = ({ name, onChange, required }) => (
  <FormGroup>
    <RequiredFieldLabel label={capitalize(name)} required={required} />
    <FormControl
      type="text"
      onChange={onChange}
      name={name} />
  </FormGroup>
);

FormTextField.propTypes = {
  name: string.isRequired,
  onChange: func.isRequired,
  required: bool
};

export default FormTextField;
