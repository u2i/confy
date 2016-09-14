import React from 'react';
import { If } from 'react-if';
import EventSchema from 'proptypes/schemas/EventSchema';

const DESCRIPTION_LENGTH = 50;
export default class EventDescription extends React.Component {
  static propTypes = {
    event: EventSchema.only('description').isRequired
  };

  constructor(...args) {
    super(...args);
    this.state = { fullDescription: false };

    this._handleFullDescription = this._handleFullDescription.bind(this);
  }

  _descriptionContent() {
    if (!this.props.event.description) {
      return;
    }
    else if (this.state.fullDescription) {
      return this._fullDescription();
    }
    return this._shortDescription();
  }

  _fullDescription() {
    return this.props.event.description;
  }

  _shortDescription() {
    return this.props.event.description.slice(0,DESCRIPTION_LENGTH) + '...';
  }

  _handleFullDescription(event) {
    event.stopPropagation();
    this._changeDescriptionLength();
  }

  _changeDescriptionLength() {
    this.setState({ fullDescription: !this.state.fullDescription });
  }

  _expansionMessage() {
    return this.state.fullDescription ? ' Less' : ' More';
  }

  render() {
    return (
      <div className="event-description">
        <If condition={typeof this.props.event.description !== 'undefined'}>
          <div>
            <small>Description:&nbsp;</small>
            <p style={{display: 'inline'}}>{this._descriptionContent()}</p>
            <div style={{display: 'inline'}} onClick={this._handleFullDescription}>
              <a>{this._expansionMessage()}</a>
            </div>
          </div>
        </If>
      </div>
    );
  }
};
