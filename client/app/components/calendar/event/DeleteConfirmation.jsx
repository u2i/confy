import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteConfirmation = ({ onHide, show, cancelHandler, confirmHandler }) => (
  <Modal bsSize="small"
         show={show}
         onHide={onHide}
         className="delete-confirmation-modal">
    <Modal.Header className="text-center">
      Are you sure?
    </Modal.Header>
    <Modal.Footer className="confirmation-footer">
      <Button onClick={cancelHandler}>Cancel</Button>
      <Button bsStyle="danger" onClick={confirmHandler}>Delete</Button>
    </Modal.Footer>
  </Modal>
);

DeleteConfirmation.propTypes = {
  onHide:         React.PropTypes.func.isRequired,
  show:           React.PropTypes.bool.isRequired,
  cancelHandler:  React.PropTypes.func.isRequired,
  confirmHandler: React.PropTypes.func.isRequired
};
export default DeleteConfirmation;