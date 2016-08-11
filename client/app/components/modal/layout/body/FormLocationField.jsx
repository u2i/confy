import React from "react";
import { FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import { If } from "react-if";

const { array, func } = React.PropTypes;
import RoomSelectGroup from './RoomSelectGroup';

import './form_location_field.scss';

export default class FormLocationField extends React.Component {
  static propTypes = {
    available:   array.isRequired,
    unavailable: array.isRequired,
    onChange:    func.isRequired,
    errors:      array
  };

  static defaultProps = {
    errors: []
  };

  render() {
    const { available, unavailable, onChange, errors } = this.props;
    return (
      <FormGroup>
        <ControlLabel>Location:</ControlLabel>
        <FormControl componentClass="select"
                     onChange={onChange}
                     name="location"
                     selected={available.length > 0 ? available[0].id : ''}>
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
