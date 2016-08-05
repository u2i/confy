import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const { func, bool } = React.PropTypes;

const ModalFooter = (props) => (
  <Modal.Footer>
    <Button onClick={props.closeModal}>
      Close
    </Button>
    <Button bsStyle="primary"
            onClick={props.saveChanges}
            disabled={props.disableSaving} >
      Save changes
    </Button>
  </Modal.Footer>
);

ModalFooter.propTypes = {
  closeModal:    func.isRequired,
  saveChanges:   func.isRequired,
  disableSaving: bool
};

ModalFooter.defaultProps = {
  disableSaving: false
};

export default ModalFooter;
