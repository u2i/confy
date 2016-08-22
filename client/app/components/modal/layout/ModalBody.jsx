import React from 'react';
import { Modal, Col } from 'react-bootstrap';
import bindAll from 'lodash/bindAll';
import FormTextField from './body/FormTextField';
import FormDateField from './body/FormDateField';
import FormLocationField from './body/FormLocationField';
import ErrorField from './ErrorField';
import GuestsField from './body/GuestsField';

const { func, array, object, bool, number } = React.PropTypes;

export default class ModalBody extends React.Component {
  static propTypes = {
    updateParam: func.isRequired,
    availableLocations: array.isRequired,
    unavailableLocations: array.isRequired,
    selectedLocation: number,
    errors: object,
    showErrorMessage: bool
  };

  static defaultProps = {
    showErrorMessage: false,
    errors: {}
  };

  constructor(props) {
    super(props);

    bindAll(this,
      ['handleTextFieldChange', 'handleLocationChange', 'handleStartTimeChange', 'handleEndTimeChange',
        'handleGuestsChange']);
  }

  handleTextFieldChange(e) {
    const value = e.target.value;
    const name = e.target.name;

    this.props.updateParam(name, value);
  }

  handleLocationChange(e) {
    this.props.updateParam('conferenceRoomId', parseInt(e.target.value, 10));
  }

  handleStartTimeChange(e) {
    this._updateDateParam('startTime', e);
  }

  handleEndTimeChange(e) {
    this._updateDateParam('endTime', e);
  }

  handleGuestsChange(e) {
    this.props.updateParam('attendees', e);
  }

  render() {
    return (
      <Modal.Body>
        <ErrorField show={this.props.showErrorMessage} />
        <form>
            <FormTextField
              name={"summary"}
              onChange={this.handleTextFieldChange} />
            <FormTextField
              name={"description"}
              onChange={this.handleTextFieldChange} />
            <section className="row">
              <Col xs={12} md={6}>
                <FormDateField
                  label={"Start time"}
                  onChange={this.handleStartTimeChange}
                  errors={this.props.errors.start_time || []} />
              </Col>
              <Col xs={12} md={6} className="pull-right">
                <FormDateField
                  label={"End time"}
                  onChange={this.handleEndTimeChange} />
              </Col>
            </section>
            <FormLocationField
              available={this.props.availableLocations}
              unavailable={this.props.unavailableLocations}
              selected={this.props.selectedLocation}
              onChange={this.handleLocationChange}
              validationState={!!this.props.errors.conference_room_id}
              errors={this.props.errors.conference_room_id || []} />
            <GuestsField
              onChange={this.handleGuestsChange} />
        </form>
      </Modal.Body>
    );
  }

  _updateDateParam(key, value) {
    if (value !== 'Invalid date') {
      this.props.updateParam(key, value);
    }
  }
}
