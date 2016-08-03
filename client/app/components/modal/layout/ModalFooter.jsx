import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const { func } = React.PropTypes;

const ModalFooter = (props) => (
  <Modal.Footer>
    <Button onClick={props.closeModal}>
      Close
    </Button>
    <Button bsStyle="primary"
            onClick={props.saveChanges}>
      Save changes
    </Button>
  </Modal.Footer>
);

ModalFooter.propTypes = {
  closeModal:  func.isRequired,
  saveChanges: func.isRequired
};

export default ModalFooter;