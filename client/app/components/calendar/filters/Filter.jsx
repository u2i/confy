import React from 'react';
import { Checkbox } from 'react-bootstrap';
import ConferenceRoomSchema from 'schemas/ConferenceRoomSchema';

import './filters.scss';

export default class Filter extends React.Component {
  static propTypes = {
    onEnabled:      React.PropTypes.func.isRequired,
    onDisabled:     React.PropTypes.func.isRequired,
    conferenceRoom: ConferenceRoomSchema.isRequired,
    enabled:        React.PropTypes.bool
  };

  static defaultProps = {
    enabled: false
  };

  constructor(...args) {
    super(...args);

    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle(e) {
    if (e.target.checked) {
      this.props.onDisabled(this.props.conferenceRoom.id);
    } else {
      this.props.onEnabled(this.props.conferenceRoom.id);
    }
  }

  render() {
    return (
      <div className="filter-box" style={{ backgroundColor: this.props.conferenceRoom.color }}>
        <Checkbox onChange={this.handleToggle}
                  checked={!this.props.enabled}
                  inline>
          {this.props.conferenceRoom.title}
        </Checkbox>
      </div>
    );
  }
}
