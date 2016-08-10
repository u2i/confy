import React, { PropTypes } from 'react';
import { Tooltip, Overlay, Button } from 'react-bootstrap';
import { If, Else } from 'react-if';
import './event.scss';

const TOOLTIP_MESSAGE = 'You are not the owner of this event';

export default class DeleteButton extends React.Component {
  static propTypes = {
    id:       PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      showIndicator: false,
      showConfirmationBox: false
    };

    this._handleOnClick = this._handleOnClick.bind(this);
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
          <Overlay target={() => this.refs.target}
                   show={this.state.showIndicator}
                   placement="right">
            <Tooltip id="tooltip">{TOOLTIP_MESSAGE}</Tooltip>
          </Overlay>
          <Else>
            <Overlay target={() => this.refs.target}
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
    return this.props.onDelete(this.props.id);
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
