import React, { PropTypes } from 'react';
import { Tooltip, Overlay } from 'react-bootstrap';
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

    this.state = {
      showIndicator: false
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
        </If>
      </div>
    );
  }

  _handleOnClick() {
    if (!this.props.disabled) {
      return this.props.onDelete(this.props.id);
    }

    this.setState({
      showIndicator: true
    });

    setTimeout(() => this.setState({ showIndicator: false }), 2000);

    return false;
  }
}
