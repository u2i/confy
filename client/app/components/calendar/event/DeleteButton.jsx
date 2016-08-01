import React, { PropTypes } from 'react';
import axios from 'axios';
import './event.scss';

export default class DeleteButton extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  };
  constructor(...args) {
    super(...args);
    this._handleDelete = this._handleDelete.bind(this);
  }

  render() {
    return (
      <span onClick={this._handleDelete} className="delete-button glyphicon glyphicon-remove">
      </span>
    );
  }

  _path() {
    return `/events/${this.props.id}`;
  }

  _handleDelete(event) {
    event.preventDefault();
    const token = document.querySelector('meta[name="csrf-token"]').content;

    axios({
      method: 'DELETE',
      url: this._path(),
      headers: {
        'X-CSRF-Token': token
      }
    }).then(() => {
      window.location.reload(true); // Reload Events here
    }).catch(() => {
      alert('Server error'); // Yep
    });
  }
}
