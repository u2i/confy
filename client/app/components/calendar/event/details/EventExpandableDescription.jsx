import React from 'react';
import { MAX_DESCRIPTION_LENGTH } from 'helpers/EventHelper';

export default class EventExpandableDescription extends React.Component {
  static propTypes = {
    description: React.PropTypes.string
  };

  constructor(...args) {
    super(...args);
    this.state = { showFullDescription: false };

    this._toggleFullDescription = this._toggleFullDescription.bind(this);
  }

  render() {
    return (
      <div className="event-description">
        <div>
          <small>Description:&nbsp;</small>
          <p style={{ display: 'inline' }}>{this._descriptionContent()}</p>
          <a onClick={this._toggleFullDescription}>{this._expansionMessage()}</a>
        </div>
      </div>
    );
  }

  _descriptionContent() {
    if (this.state.showFullDescription) {
      return this._fullDescription();
    }
    return this._shortDescription();
  }

  _fullDescription() {
    return this.props.description;
  }

  _shortDescription() {
    return `${this.props.description.slice(0, MAX_DESCRIPTION_LENGTH)}...`;
  }

  _toggleFullDescription(event) {
    event.stopPropagation();
    this.setState({ showFullDescription: !this.state.showFullDescription });
  }

  _expansionMessage() {
    return this.state.showFullDescription ? ' Less' : ' More';
  }
}
