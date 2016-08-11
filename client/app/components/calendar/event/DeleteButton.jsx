import React, { PropTypes } from 'react';
import './event.scss';

export default class DeleteButton extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
  };

  render() {
    const enabled = this.props.disabled ? 'disabled' : 'enabled';

    return (
      <span onClick={this.props.onClick}
            className={`delete-button glyphicon glyphicon-remove ${enabled}`}>
      </span>
    );
  }
}

