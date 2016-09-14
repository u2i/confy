import React from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { If } from 'react-if';

import RoomSelectGroup from './RoomSelectGroup';

const { array, number, func, bool } = React.PropTypes;

import './form_location_field.scss';

export default class FormLocationField extends React.Component {
  static propTypes = {
    available: array,
    unavailable: array,
    onChange: func.isRequired,
    selected: number,
    errors: array,
    required: bool
  };

  static defaultProps = {
    errors: [],
    available: [],
    unavailable: []
  };

  render() {
    const { available, unavailable, selected, onChange, errors } = this.props;
    return (
      <FormGroup>
        <ControlLabel>Location:{this.props.required ? '*' : ''}</ControlLabel>
        <FormControl componentClass="select"
                     onChange={onChange}
                     name="location"
                     value={selected || ''}>
          <option value="" disabled style={{ display: 'none' }} />
          <RoomSelectGroup rooms={available} label="Available" />
          <RoomSelectGroup rooms={unavailable} label="Unavailable" />
        </FormControl>
        <If condition={errors != null}>
          <div className="text-danger">{errors[0]}</div>
        </If>
      </FormGroup>
    );
  }
}
