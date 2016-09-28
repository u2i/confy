import React, { PropTypes } from 'react';
import './event.scss';

export default class DeleteButton extends React.Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired
  };

  render() {
    return (
      <span onClick={this.props.onClick}
            className={'delete-button glyphicon glyphicon-trash enabled'}>
      </span>
    );
  }
}
