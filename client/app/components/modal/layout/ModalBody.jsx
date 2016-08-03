import React from 'react';
import { Modal } from 'react-bootstrap';
import {If, Then} from 'react-if';
import _ from 'lodash';
import FormTextField from './body/FormTextField';
import FormDateField from './body/FormDateField';
import FormLocationField from './body/FormLocationField';

const {func, array} = React.PropTypes;

export default class ModalBody extends React.Component {
  static propTypes = {
    updateParam:     func.isRequired,
    conferenceRooms: array.isRequired
  };

  constructor(props) {
    super(props);

    _.bindAll(this,
      ['handleTextFieldChange', 'handleLocationChange', 'handleStartTimeChange', 'handleEndTimeChange']);
  }

  handleTextFieldChange(e) {
    const value = e.target.value;
    const name = e.target.name;

    this.props.updateParam(name, value);
  }

  handleLocationChange(e) {
    this.props.updateParam('conferenceRoomId', e.target.value);
  }

  handleStartTimeChange(e) {
    if (e !== 'Invalid date') {
      this.props.updateParam('startTime', e);
    }
  }

  handleEndTimeChange(e) {
    if (e !== 'Invalid date') {
      this.props.updateParam('endTime', e);
    }
  }

  render() {
    return (
      <Modal.Body>
        <form>
          <FormTextField
            name={"summary"}
            onChange={this.handleTextFieldChange} />
          <FormTextField
            name={"description"}
            onChange={this.handleTextFieldChange} />
          <FormDateField
            label={"Start time"}
            onChange={this.handleStartTimeChange} />
          <FormDateField
            label={"End time"}
            onChange={this.handleEndTimeChange} />
          <FormLocationField
            conferenceRooms={this.props.conferenceRooms}
            onChange={this.handleLocationChange} />
        </form>
      </Modal.Body>
    );
  }
}
