import React from 'react'
import { Button } from 'react-bootstrap';

export default class SideNav extends React.Component {
  constructor() {
    super();

    this._handleCreateEvent = this._handleCreateEvent.bind(this);
  }

  _handleCreateEvent() {
    this.props.openModal();
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
    )
  }
}
