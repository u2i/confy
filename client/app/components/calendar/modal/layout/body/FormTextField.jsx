import React from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import _ from 'lodash';

const { string, func, bool } = React.PropTypes;

const FormTextField = ({ name, onChange, required }) => (
  <FormGroup>
    <ControlLabel>
      {_.capitalize(name)}:{required ? '*' : ''}
    </ControlLabel>
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
