import React from 'react';
import moment from 'moment';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import DateTimeField from 'react-bootstrap-datetimepicker';

import 'react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css';

const { string, func } = React.PropTypes;
const DATE_FORMAT = 'DD/MM/YYYY HH:mm';

const FormDateField = (props) => (
  <FormGroup>
    <ControlLabel>
      {props.label}:
    </ControlLabel>
    <DateTimeField
      dateTime={moment().format(DATE_FORMAT)}
      format={DATE_FORMAT}
      inputFormat={DATE_FORMAT}
      onChange={props.onChange} />
  </FormGroup>
);

FormDateField.propTypes = {
  label:       string.isRequired,
  onChange:    func.isRequired
};

export default FormDateField;
