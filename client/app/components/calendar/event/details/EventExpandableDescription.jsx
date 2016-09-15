import React from 'react';

const SHORT_DESCRIPTION_LENGTH = 50;
export default class EventExpandableDescription extends React.Component {
  static propTypes = {
    description: React.PropTypes.string
  };

  constructor(...args) {
    super(...args);
    this.state = { fullDescription: false };

    this._handleDescriptionLength = this._handleDescriptionLength.bind(this);
  }

  render() {
    return (
      <div className="event-description">
        <div>
          <small>Description:&nbsp;</small>
          <p style={{ display: 'inline' }}>{this._descriptionContent()}</p>
          <a onClick={this._handleDescriptionLength}>{this._expansionMessage()}</a>
        </div>
      </div>
    );
  }

  _descriptionContent() {
    if (this.state.fullDescription) {
      return this._fullDescription();
    }
    return this._shortDescription();
  }

  _fullDescription() {
    return this.props.description;
  }

  _shortDescription() {
    return `${this.props.description.slice(0, SHORT_DESCRIPTION_LENGTH)}...`;
  }

  _handleDescriptionLength(event) {
    event.stopPropagation();
    this._changeDescriptionLength();
  }

  _changeDescriptionLength() {
    this.setState({ fullDescription: !this.state.fullDescription });
  }

  _expansionMessage() {
    return this.state.fullDescription ? ' Less' : ' More';
  }
}
