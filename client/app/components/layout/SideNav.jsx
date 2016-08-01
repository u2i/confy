import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';

const { func } = PropTypes;

export default class SideNav extends React.Component {
  static propTypes = {
    openModal: func.isRequired
  };

  constructor() {
    super();

    this._handleCreateEvent = this._handleCreateEvent.bind(this);
  }

  render() {
    return (
      <div>
        <Button bsStyle="primary" className="btn-block"
                onClick={this._handleCreateEvent}>
          Create Event
        </Button>
        <Button bsStyle="primary" className="btn-block">Home</Button>
        <Button bsStyle="primary" className="btn-block">Next Week</Button>
        <Button bsStyle="primary" className="btn-block">Previous Week</Button>
      </div>
    );
  }

  _handleCreateEvent() {
    this.props.openModal();
  }
}
