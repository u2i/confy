import React from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import RequiredFieldLabel from './RequiredFieldLabel';
import { If } from 'react-if';

import RoomSelectGroup from './RoomSelectGroup';

const { string, array, number, func, bool } = React.PropTypes;

import './form_location_field.scss';

export default class FormLocationField extends React.Component {
  static propTypes = {
    available: array,
    unavailable: array,
    onChange: func.isRequired,
    selected: number,
    error: string,
    required: bool
  };

  static defaultProps = {
    available: [],
    unavailable: []
  };

  render() {
    const { available, unavailable, selected, onChange, error, required } = this.props;
    return (
      <FormGroup>
        <RequiredFieldLabel label="Location" required={required} />
        <FormControl componentClass="select"
                     onChange={onChange}
                     name="location"
                     value={selected || ''}>
          <option value="" disabled style={{ display: 'none' }} />
          <RoomSelectGroup rooms={available} label="Available" />
          <RoomSelectGroup rooms={unavailable} label="Unavailable" />
        </FormControl>
        <If condition={typeof error !== 'undefined'}>
          <div className="text-danger">{error}</div>
        </If>
      </FormGroup>
    );
  }
}
