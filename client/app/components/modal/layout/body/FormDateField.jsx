import React from 'react';
import moment from 'moment';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import DateTimeField from 'react-bootstrap-datetimepicker';
import { If } from 'react-if';

import 'react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css';

const { string, func, array } = React.PropTypes;
const DATE_FORMAT = 'DD/MM/YYYY HH:mm';

const initialDate = moment().format(DATE_FORMAT);

const FormDateField = (props) => (
  <FormGroup>
    <ControlLabel>
      {props.label}:
    </ControlLabel>
    <DateTimeField
      dateTime={initialDate}
      format={DATE_FORMAT}
      inputFormat={DATE_FORMAT}
      onChange={props.onChange} />
    <If condition={props.errors != undefined}>
      <div className="text-danger">{props.errors[0]}</div>
    </If>
  </FormGroup>
);

FormDateField.propTypes = {
  label:       string.isRequired,
  onChange:    func.isRequired,
  errors:      array
};

FormDateField.defaultProps = {
  errors: []
};

export default FormDateField;
