import React, { PropTypes } from 'react';
import axios from 'axios';
import './event.scss';
import EventSource from 'sources/EventSource';

export default class DeleteButton extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired
  };

  render() {
    return (
      <span onClick={() => this.props.onDelete(this.props.id)} className="delete-button glyphicon glyphicon-remove">
      </span>
    );
  }
}
