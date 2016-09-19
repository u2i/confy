import React from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

const RecurrenceComponent = (props) => (
  <FormGroup>
    <ControlLabel>Repeat:</ControlLabel>
    <FormControl onChange={props.onChange} componentClass="select" placeholder="select" defaultValue="none">
      <option value="none">none</option>
      <option value="daily">daily</option>
      <option value="weekly">weekly</option>
      <option value="every_other_week">every other week</option>
      <option value="monthly">monthly</option>
    </FormControl>
  </FormGroup>
);

export default RecurrenceComponent;
