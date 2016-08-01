import React, { PropTypes } from 'react';
import { Button, Modal, FormGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap';
import DateTimeField from 'react-bootstrap-datetimepicker';
import moment from 'moment';
import _ from 'lodash';
import EventSource from 'sources/EventSource';

import 'react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css';

const { func, bool, array, string } = PropTypes;

const DATE_FORMAT = 'DD/MM/YYYY HH:mm';

export default class CreateEventModal extends React.Component {
  static propTypes = {
    closeModal:      func.isRequired,
    showModal:       bool.isRequired,
    conferenceRooms: array.isRequired,
    initialDate:     string
  };

  static defaultProps = {
    initialDate: moment().format(DATE_FORMAT)
  };

  constructor(props) {
    super(props);

    this.state = {
      showErrorMessage: false,
      conferenceRoomId: this.props.conferenceRooms[0].id,
      startTime:        this.props.initialDate,
      endTime:          this.props.initialDate
    };

    _.bindAll(this,
      ['saveChanges', 'handleTextFieldChange', 'handleLocationChange',
        'handleStartTimeChange', 'handleEndTimeChange']);
  }

  handleTextFieldChange(e) {
    const value = e.target.value;
    const name = e.target.name;

    this.setState({ [name]: value });
  }

  handleLocationChange(e) {
    const conferenceRoomId = e.target.value;
    this.setState({ conferenceRoomId });
  }

  handleStartTimeChange(e) {
    if (e !== 'Invalid date') {
      this.setState({ startTime: e });
    }
  }

  handleEndTimeChange(e) {
    if (e !== 'Invalid date') {
      this.setState({ endTime: e });
    }
  }

  saveChanges() {
    const eventParams = {
      summary:            this.state.summary ? this.state.summary : '',
      description:        this.state.description ? this.state.description : '',
      start_time:         this.state.startTime,
      end_time:           this.state.endTime,
      conference_room_id: this.state.conferenceRoomId
    };

    EventSource.create(eventParams)
      .then(() => {
        this.props.closeModal();
      })
      .catch(() => {
        this._showError();
      });
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
                onChange={this.handleTextFieldChange}
                name="summary" />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Description:</ControlLabel>
              <FormControl
                type="text"
                value={this.state.description}
                onChange={this.handleTextFieldChange}
                name="description" />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Start time:</ControlLabel>
              <DateTimeField
                dateTime={this.state.startTime}
                format={DATE_FORMAT}
                inputFormat={DATE_FORMAT}
                onChange={this.handleStartTimeChange} />
            </FormGroup>
            <FormGroup>
              <ControlLabel>End time:</ControlLabel>
              <DateTimeField
                dateTime={this.state.endTime}
                format={DATE_FORMAT}
                inputFormat={DATE_FORMAT}
                onChange={this.handleEndTimeChange} />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Location:</ControlLabel>
              <FormControl
                componentClass="select"
                onChange={this.handleLocationChange}
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
            onClick={this.saveChanges}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  _showError() {
    this.setState({ showErrorMessage: true });
  }
}
