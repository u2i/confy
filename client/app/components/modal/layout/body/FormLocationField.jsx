import React from "react";
import { FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import { If } from "react-if";

const { array, func } = React.PropTypes;

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
          <If condition={available.length > 0}>
            <optgroup label="Available">
              {available.map(room => (
                <option value={room.id} key={room.id}>{room.title}</option>
              ))}
            </optgroup>
          </If>
          <If condition={unavailable.length > 0}>
            <optgroup label="Unavailable" className="disabled">
              {unavailable.map(room => (
                <option value={room.id} key={room.id}>{room.title}</option>
              ))}
            </optgroup>
          </If>
        </FormControl>
        <If condition={errors != null}>
          <div className="text-danger">{errors[0]}</div>
        </If>
      </FormGroup>
    );
  }
}
