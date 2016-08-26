import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import EventSchema from 'schemas/EventSchema';
import { eventTimeString } from 'helpers/DateHelper';
import moment from 'moment';

const TIME_FORMAT = 'HH:mm';
const DATE_FORMAT = 'Mo MMM YYYY';

const DeleteConfirmation = ({ onHide, show, onCancel, onConfirm, event }) => (
  <Modal show={show}
         onHide={onHide}
         className="delete-confirmation-modal">
    <Modal.Header className="text-center" closeButton>
      Are you sure you want to delete this event?
    </Modal.Header>
    <Modal.Body className="delete-confirmation-modal modal-body">
      <h1 className="summary">{event.summary}</h1>
      <p>
        <em>on </em>
        <strong>{moment(event.start.date_time).format(DATE_FORMAT)} </strong>
        ({eventTimeString(event, TIME_FORMAT)})
      </p>
      <p>
        <em>in </em>
        {event.conference_room.title}
      </p>
      <p>
        <em>by </em>
        {event.creator.email}
      </p>
    </Modal.Body>
    <Modal.Footer className="delete-confirmation-modal">
      <Button onClick={onCancel}
              className="cancel-delete">
        Cancel
      </Button>
      <Button bsStyle="danger"
              onClick={onConfirm}
              className="confirm-delete">
        Delete
      </Button>
    </Modal.Footer>
  </Modal>
);

DeleteConfirmation.propTypes = {
  onHide:         React.PropTypes.func.isRequired,
  show:           React.PropTypes.bool.isRequired,
  cancelHandler:  React.PropTypes.func.isRequired,
  confirmHandler: React.PropTypes.func.isRequired,
  event:          EventSchema.isRequired
};

export default DeleteConfirmation;
