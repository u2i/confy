import React, {PropTypes} from "react";
import {Modal} from "react-bootstrap";
import moment from "moment";
import _ from "lodash";
import EventSource from "sources/EventSource";
import ModalHeader from "./layout/ModalHeader";
import ModalFooter from "./layout/ModalFooter";
import ModalBody from "./layout/ModalBody";

const { func, bool, array, string } = PropTypes;
const DATE_FORMAT = 'DD/MM/YYYY HH:mm';

export default class CreateEventModal extends React.Component {
  static propTypes = {
    closeModal:      func.isRequired,
    showModal:       bool.isRequired,
    conferenceRooms: array.isRequired,
    initialDate:     string,
    refresh:         func.isRequired
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
      endTime:          this.props.initialDate,
      disableSaving:    true,
      errors:           {}
    };

    _.bindAll(this,
      ['saveChanges', 'updateParam']);
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
        this.props.refresh();
      })
      .catch((e) => {
        console.log(e);
        if (e.statusText === 'Unprocessable Entity') {
          if (!e.data) {
            this._showError();
          } else {
            this.setState({ errors: e.data });
          }
        } else {
          this._showError();
        }
      });
  }

  updateParam(key, value) {
    this.setState({ [key]: value }, () => this._validateParams(key));
  }

  render() {
    return (
      <Modal
        show={this.props.showModal}
        onHide={this.props.closeModal}
        onExited={() => this.setState({ showErrorMessage: false })}>

        <ModalHeader />
        <ModalBody
          updateParam={this.updateParam}
          conferenceRooms={this.props.conferenceRooms}
          showErrorMessage={this.state.showErrorMessage}
          errors={this.state.errors} />
        <ModalFooter
          closeModal={this.props.closeModal}
          saveChanges={this.saveChanges}
          disableSaving={this.state.disableSaving} />

      </Modal>
    );
  }

  _validateTimeRange() {
    if (this.state.startTime >= this.state.endTime) {
      this.setState({ disableSaving: true });
    } else {
      this.setState({ disableSaving: false });
    }
  }

  _validateParams(key) {
    if (key === 'startTime' || key === 'endTime') {
      this._validateTimeRange();
    }
  }

  _showError() {
    this.setState({ showErrorMessage: true });
  }
}
