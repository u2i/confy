import React from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import { If } from 'react-if';

const { array, func } = React.PropTypes;

export default class FormLocationField extends React.Component {
  static propTypes = {
    conferenceRooms: array.isRequired,
    onChange:        func.isRequired,
    errors:          array
  };

  static defaultProps = {
    errors: []
  }

  render() {
    const conferenceRoomsOptions = this.props.conferenceRooms.map(room => (
      <option value={room.id} key={room.id}>{room.title}</option>
    ));

    return (
      <FormGroup>
        <ControlLabel>Location:</ControlLabel>
        <FormControl componentClass="select"
                     onChange={this.props.onChange}
                     name="location">
          {conferenceRoomsOptions}
        </FormControl>
        <If condition={this.props.errors != null}>
          <HelpBlock className="text-danger">{this.props.errors[0]}</HelpBlock>
        </If>
      </FormGroup>
    );
  }
}
