import React, { PropTypes } from 'react';
import { Button, Modal, FormGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap';
import DateTimeField from 'react-bootstrap-datetimepicker';
import moment from 'moment';
import axios from 'axios';
import _ from 'lodash';

import 'react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css';

const { func, bool, array } = PropTypes;

const DATE_FORMAT = 'DD/MM/YYYY HH:mm';

export default class CreateEventModal extends React.Component {
  static propTypes = {
    openModal:       func,
    closeModal:      func,
    showModal:       bool,
    conferenceRooms: array
  };

  constructor() {
    super();

    const initialDate = moment().format(DATE_FORMAT);

    this.state = {
      showErrorMessage: false,
      conferenceRoomId: 1,
      startTime:        initialDate,
      endTime:          initialDate
    };

    _.bindAll(this,
      ['_saveChanges', '_handleTextFieldChange', '_handleLocationChange',
        '_handleStartTimeChange', '_handleEndTimeChange']);
  }

  render() {
    let conferenceRoomsOptions = this.props.conferenceRooms.map(room => (
      <option value={room.id} key={room.id}>{room.title}</option>
    ));

    return (
      <Modal
        show={this.props.showModal}
        onHide={this.props.closeModal}>

        <Modal.Header closeButton>
          <Modal.Title>Create event</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.state.showErrorMessage ?
            <Alert bsStyle="danger">
              Error occured while trying to save event.
            </Alert>
            : null}

          <form>
            <FormGroup>
              <ControlLabel>Name:</ControlLabel>
              <FormControl
                type="text"
                value={this.state.summary}
                onChange={this._handleTextFieldChange}
                name="summary" />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Description:</ControlLabel>
              <FormControl
                type="text"
                value={this.state.description}
                onChange={this._handleTextFieldChange}
                name="description" />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Start time:</ControlLabel>
              <DateTimeField
                dateTime={this.state.startTime}
                format={DATE_FORMAT}
                inputFormat={DATE_FORMAT}
                onChange={this._handleStartTimeChange} />
            </FormGroup>
            <FormGroup>
              <ControlLabel>End time:</ControlLabel>
              <DateTimeField
                dateTime={this.state.endTime}
                format={DATE_FORMAT}
                inputFormat={DATE_FORMAT}
                onChange={this._handleEndTimeChange} />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Location:</ControlLabel>
              <FormControl
                componentClass="select"
                onChange={this._handleLocationChange}
                name="location">
                {conferenceRoomsOptions}
              </FormControl>
            </FormGroup>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.props.closeModal}>Close</Button>
          <Button
            bsStyle="primary"
            onClick={this._saveChanges}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }


  _handleTextFieldChange(e) {
    const value = e.target.value;
    const name = e.target.name;

    this.setState({ [name]: value });
  }

  _handleLocationChange(e) {
    const conferenceRoomId = e.target.value;

    // only temporary, waiting for event API improvement
    const conferenceRoomName = this.props.conferenceRooms.find(room =>
      room.id === parseInt(conferenceRoomId, 10)
    ).title;

    this.setState({
      location: conferenceRoomName,
      conferenceRoomId
    });
  }

  _handleStartTimeChange(e) {
    if (e !== 'Invalid date') {
      this.setState({ startTime: e });
    }
  }

  _handleEndTimeChange(e) {
    if (e !== 'Invalid date') {
      this.setState({ endTime: e });
    }
  }

  _showError() {
    this.setState({ showErrorMessage: true });
  }

  _saveChanges() {
    const eventParams = {
      summary:            this.state.summary ? this.state.summary : '',
      description:        this.state.description ? this.state.description : '',
      start_time:         this.state.startTime,
      end_time:           this.state.endTime,
      conference_room_id: this.state.conferenceRoomId,
      location:           this.state.location
    };

    const token = document.querySelector('meta[name="csrf-token"]').content;

    axios({
      method:  'post',
      url:     '/events',
      data:    eventParams,
      headers: {
        'X-CSRF-Token': token
      }
    })
      .then(() => {
        this.props.closeModal();
      })
      .catch(() => {
        this._showError();
      });
  }

}
