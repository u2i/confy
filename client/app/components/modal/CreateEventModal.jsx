import React, { PropTypes } from 'react';
import instanceOfMoment from 'proptypes/moment';
import { Modal } from 'react-bootstrap';
import moment from 'moment';
import defaults from 'lodash/defaults';
import bindAll from 'lodash/bindAll';
import flow from 'lodash/fp/flow';
import map from 'lodash/fp/map';
import uniqBy from 'lodash/fp/uniqBy';
import differenceBy from 'lodash/differenceBy';
import isEmpty from 'lodash/isEmpty';
import EventSource from 'sources/EventSource';
import ModalHeader from './layout/ModalHeader';
import ModalFooter from './layout/ModalFooter';
import ModalBody from './layout/ModalBody';
import * as DateHelper from 'helpers/DateHelper';

const { func, bool, array, number, string } = PropTypes;
const DATE_ERROR_TEXT = 'Start time must be lower than end time';
const NO_LOCATION_ERROR = 'You must select a location';
const LOCATION_ERROR = 'This room is not available during the selected time.';

const INITIAL_FORM_STATE = {
  showErrorMessage: false,
  summary: '',
  description: '',
  conferenceRoomId: null,
  attendees: [],
  errors: {},
  disableSaving: false
};

export default class CreateEventModal extends React.Component {
  static propTypes = {
    closeModal: func.isRequired,
    showModal: bool.isRequired,
    conferenceRooms: array.isRequired,
    initialDate: instanceOfMoment,
    initialLength: number,
    dateFormat: string,
    refresh: func.isRequired,
    onError: func.isRequired
  };

  static defaultProps = {
    initialDate: moment(),
    initialLength: 1,
    dateFormat: 'DD/MM/YYYY HH:mm'
  };

  constructor(props) {
    super(props);

    this.state = this._initialFormState();

    bindAll(this,
      ['saveChanges', 'updateParam', 'handleCloseModal']);
  }

  componentDidMount() {
    this._updateRoomAvailability();
  }

  componentDidUpdate(_, prevState) {
    if (prevState.startTime !== this.state.startTime || prevState.endTime !== this.state.endTime) {
      this._updateRoomAvailability();
    }
  }

  handleCloseModal() {
    this._clearForm();
    this.props.closeModal();
  }

  saveChanges() {
    if (!this._validateParams({ presence: true })) return;
    this.setState({ disableSaving: true });

    const eventParams = {
      summary: this.state.summary,
      description: this.state.description,
      start_time: DateHelper.normalizeDate(this.state.startTime, DateHelper.DATE_DISPLAY_FORMAT),
      end_time: DateHelper.normalizeDate(this.state.endTime, DateHelper.DATE_DISPLAY_FORMAT),
      conference_room_id: this.state.conferenceRoomId,
      attendees: this._attendeesParam()
    };

    EventSource.create(eventParams)
      .then(() => {
        this.handleCloseModal();
        this.props.refresh();
      })
      .catch((e) => {
        if (e.statusText === 'Unprocessable Entity' && e.data) {
          this.setState({ errors: e.data });
        } else {
          this._showError();
        }
        this.setState({ disableSaving: false });
      });
  }

  updateParam(key, value) {
    this.setState({ [key]: value }, () => this._validateParams());
  }

  render() {
    return (
      <Modal
        show={this.props.showModal}
        onHide={this.props.closeModal}
        onExited={this.handleCloseModal}>

        <ModalHeader />
        <ModalBody
          availableLocations={this.state.availableRooms}
          unavailableLocations={this.state.unavailableRooms}
          selectedLocation={this.state.conferenceRoomId}
          startTime={this.state.startTime}
          endTime={this.state.endTime}
          dateFormat={this.props.dateFormat}
          updateParam={this.updateParam}
          showErrorMessage={this.state.showErrorMessage}
          errors={this.state.errors}
          onError={this.props.onError} />
        <ModalFooter
          closeModal={this.props.closeModal}
          saveChanges={this.saveChanges}
          hasUnresolvedErrors={!isEmpty(this.state.errors)}
          blockWhileSaving={this.state.disableSaving} />

      </Modal>
    );
  }

  _initialFormState() {
    const startTime = this.props.initialDate.format(this.props.dateFormat);
    const endTime = DateHelper
      .addTime(this.props.initialDate, this.props.initialLength, 'minutes')
      .format(this.props.dateFormat);
    return defaults({}, INITIAL_FORM_STATE, { startTime, endTime });
  }

  _validateTimeRange() {
    if (this.state.startTime >= this.state.endTime) {
      throw { key: 'start_time', message: DATE_ERROR_TEXT };
    }
  }

  _validateLocation({ presence }) {
    const currentLoc = this.state.conferenceRoomId;
    if (currentLoc) {
      const locAvailable = this.state.availableRooms.some(room => room.id === currentLoc);
      if (!locAvailable) {
        throw { key: 'conference_room_id', message: LOCATION_ERROR };
      }
    } else if (presence) {
      throw { key: 'conference_room_id', message: NO_LOCATION_ERROR };
    }
  }

  _validateParams(options = {}) {
    this._clearErrors();
    try {
      this._validateTimeRange(options);
      this._validateLocation(options);

      return true;
    } catch (error) {
      this._addError(error);
      return false;
    }
  }

  _showError() {
    this.setState({ showErrorMessage: true });
  }

  _addError({ key, message }) {
    const errors = this.state.errors;
    errors[key] = errors[key] ? errors[key].concat([message]) : [message];
    this.setState({ errors });
  }

  _clearErrors() {
    this.setState({ errors: {} });
  }

  _clearForm() {
    this.setState(this._initialFormState());
  }

  _updateRoomAvailability() {
    const { startTime, endTime } = this.state;
    EventSource
      .fetch({ start: startTime, end: endTime })
      .then(({ data }) => {
        const unavailableRooms = flow(
          map(e => e.conference_room),
          uniqBy(room => room.id)
        )(data);

        const availableRooms = differenceBy(this.props.conferenceRooms, unavailableRooms, room => room.id);

        this.setState({ availableRooms, unavailableRooms });
        this._validateParams('location');
      })
      .catch(() => this._showError());
  }

  _attendeesParam() {
    return this.state.attendees.map((guest) => ({ email: guest.email || guest.label }));
  }
}
