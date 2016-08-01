import React, { PropTypes } from 'react';
import axios from 'axios';
import './event.scss';

export default class DeleteButton extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  };

  _path() {
    return `/events/${this.props.id}`;
  }

  _processDelete(event) {
    event.preventDefault();
    let token = document.querySelector('meta[name="csrf-token"]').content;

    axios({
      method: 'DELETE',
      url: this._path(),
      headers: {
        'X-CSRF-Token': token
      }
    }).then(() => {
      window.location.reload(true); // Reload Events here
    }).catch(() => {
      alert("Server error"); // Yep
    })
  }

  render() {
    return (
      <span onClick={this._processDelete.bind(this)} className="delete glyphicon glyphicon-remove">
      </span>
    );
  }
}
