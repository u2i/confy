import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { If, Else } from 'react-if';

const { func, bool } = React.PropTypes;

const SAVE_TEXT = 'Save changes';
const SAVING_TEXT = 'Saving...';

const ModalFooter = (props) => (
  <Modal.Footer>
    <Button onClick={props.closeModal}>
      Close
    </Button>
    <Button className="save-button"
            bsStyle="primary"
            onClick={props.saveChanges}
            disabled={props.unresolvedErrors || props.blockWhileSaving}>
      <If condition={props.blockWhileSaving}>
        <span>{SAVING_TEXT}</span>
        <Else>
          <span>{SAVE_TEXT}</span>
        </Else>
      </If>
    </Button>
  </Modal.Footer>
);

ModalFooter.propTypes = {
  closeModal:       func.isRequired,
  saveChanges:      func.isRequired,
  unresolvedErrors: bool,
  blockWhileSaving: bool
};

ModalFooter.defaultProps = {
  unresolvedErrors: false,
  blockWhileSaving: false
};

export default ModalFooter;
