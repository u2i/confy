import React, { PropTypes } from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { If, Then, Else } from 'react-if';
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

    this._handleOnClick = this._handleOnClick.bind(this);
  }

  render() {
    const enabled = this.props.disabled ? 'disabled' : 'enabled';
    const tooltip = (
      <Tooltip id="tooltip">{TOOLTIP_MESSAGE}</Tooltip>
    );

    const button = (
      <span onClick={this._handleOnClick}
            className={`delete-button glyphicon glyphicon-remove ${enabled}`}>
      </span>
    );

    return (
      <If condition={this.props.disabled}>
        <Then>
          <OverlayTrigger placement="right" overlay={tooltip} trigger="click">
            {button}
          </OverlayTrigger>
        </Then>
        <Else>
          {button}
        </Else>
      </If>
    );
  }

  _handleOnClick() {
    if (!this.props.disabled) {
      return this.props.onDelete(this.props.id);
    }

    return false;
  }
}
