import React from 'react';
import { If } from 'react-if';
import EventSchema from 'proptypes/schemas/EventSchema';

const SHORT_DESCRIPTION_LENGTH = 50;
export default class EventDescription extends React.Component {
  static propTypes = {
    event: EventSchema.only('description').isRequired
  };

  constructor(...args) {
    super(...args);
    this.state = { fullDescription: false };

    this._handleDescriptionLength = this._handleDescriptionLength.bind(this);
  }

  render() {
    return (
      <div className="event-description">
        <If condition={typeof this.props.event.description !== 'undefined'}>
          <div>
            <small>Description:&nbsp;</small>
            <p style={{ display: 'inline' }}>{this._descriptionContent()}</p>
            <a onClick={this._handleDescriptionLength}>{this._expansionMessage()}</a>
          </div>
        </If>
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
    return this.props.event.description;
  }

  _shortDescription() {
    return this.props.event.description.slice(0, SHORT_DESCRIPTION_LENGTH) + '...';
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
