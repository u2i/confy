import React, { PropTypes } from 'react';
import { Tooltip, Overlay, Button } from 'react-bootstrap';
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
      showConfirmationBox: false
    };

    bindAll(this, ['_handleOnClick', '_handleConfirmDeletion', '_handleCancelDeletion']);
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
            <Overlay className="confirmation-overlay"
                     target={() => this.refs.target}
                     show={this.state.showConfirmationBox}
                     placement="right">
              <Tooltip id="confirmation-box">
                <Button bsStyle="danger" onClick={this._handleConfirmDeletion}>Delete</Button>
                <Button onClick={this._handleCancelDeletion}>Cancel</Button>
              </Tooltip>
            </Overlay>
          </Else>
        </If>
      </div>
    );
  }

  _handleConfirmDeletion() {
    this.setState({ showConfirmationBox: false });
    return this.props.onDelete();
  }

  _handleCancelDeletion() {
    this.setState({ showConfirmationBox: false });
  }

  _handleOnClickEnabled() {
    this.setState({ showConfirmationBox: true });
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
    } else {
      return this._handleOnClickDisabled();
    }
  }
}
