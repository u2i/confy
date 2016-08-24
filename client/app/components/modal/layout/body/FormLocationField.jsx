import React from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { If } from 'react-if';

import RoomSelectGroup from './RoomSelectGroup';

const { array, number, func } = React.PropTypes;

import './form_location_field.scss';

export default class FormLocationField extends React.Component {
  static propTypes = {
    available: array.isRequired,
    unavailable: array.isRequired,
    onChange: func.isRequired,
    selected: number,
    errors: array
  };

  static defaultProps = {
    errors: []
  };

  render() {
    const { available, unavailable, selected, onChange, errors } = this.props;
    return (
      <FormGroup>
        <ControlLabel>Location:</ControlLabel>
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
