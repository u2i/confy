import React from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import _ from 'lodash';

const { string, func } = React.PropTypes;

const FormTextField = (props) => (
  <FormGroup>
    <ControlLabel>
      {_.capitalize(props.name)}:
    </ControlLabel>
    <FormControl
      type="text"
      onChange={props.onChange}
      name={props.name} />
  </FormGroup>
);

FormTextField.propTypes = {
  name:     string.isRequired,
  onChange: func.isRequired
}

export default FormTextField;