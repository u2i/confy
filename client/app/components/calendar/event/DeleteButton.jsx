import React, { PropTypes } from 'react';
import { Tooltip, Overlay, Button, Modal } from 'react-bootstrap';
import { If, Else } from 'react-if';
import bindAll from 'lodash/bindAll';
import './event.scss';

const TOOLTIP_MESSAGE = 'You are not the owner of this event';

export default class DeleteButton extends React.Component {
  static propTypes = {
    onDelete: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      showIndicator: false,
      showConfirmationModal: false
    };

    bindAll(this, ['_handleOnClick', '_handleConfirmDeletion', '_hideConfirmationModal']);
  }

  render() {
    const enabled = this.props.disabled ? 'disabled' : 'enabled';

    const button = (
      <span onClick={this._handleOnClick}
            className={`delete-button glyphicon glyphicon-remove ${enabled}`}
            ref="target">
      </span>
    );

    return (
      <div>
        {button}
        <If condition={this.props.disabled}>
          <Overlay className="tooltip-overlay destroy-info-overlay"
                   target={() => this.refs.target}
                   show={this.state.showIndicator}
                   placement="right">
            <Tooltip id="tooltip">{TOOLTIP_MESSAGE}</Tooltip>
          </Overlay>
          <Else>
            <Modal bsSize="small"
                   show={this.state.showConfirmationModal}
                   onHide={this._hideConfirmationModal}
                   className="delete-confirmation-modal">
              <Modal.Header className="text-center">
                Are you sure?
              </Modal.Header>
              <Modal.Footer className="confirmation-footer">
                <Button onClick={this._hideConfirmationModal}>Cancel</Button>
                <Button bsStyle="danger" onClick={this._handleConfirmDeletion}>Delete</Button>
              </Modal.Footer>
            </Modal>
          </Else>
        </If>
      </div>
    );
  }

  _hideConfirmationModal() {
    this.setState({ showConfirmationModal: false });
  }

  _handleConfirmDeletion() {
    this._hideConfirmationModal();
    return this.props.onDelete();
  }

  _handleOnClickEnabled() {
    this.setState({ showConfirmationModal: true });
  }

  _handleOnClickDisabled() {
    this.setState({
      showIndicator: true
    });

    setTimeout(() => this.setState({ showIndicator: false }), 2000);

    return false;
  }

  _handleOnClick() {
    if (!this.props.disabled) {
      return this._handleOnClickEnabled();
    }
    return this._handleOnClickDisabled();
  }
}
