import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import EventSchema from 'schemas/EventSchema';
import EventDetails from './EventDetails';

const DeleteConfirmation = ({ onHide, show, onCancel, onConfirm, event }) => (
  <Modal show={show}
         onHide={onHide}
         className="delete-confirmation-modal">
    <Modal.Header className="text-center" closeButton>
      Are you sure you want to delete this event?
    </Modal.Header>
    <Modal.Body className="delete-confirmation-modal modal-body">
      <EventDetails event={event}
                    timeFormat="MM/DD HH:mm" />
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
  onHide:    React.PropTypes.func.isRequired,
  show:      React.PropTypes.bool.isRequired,
  onCancel:  React.PropTypes.func.isRequired,
  onConfirm: React.PropTypes.func.isRequired,
  event:     EventSchema.isRequired
};

export default DeleteConfirmation;
