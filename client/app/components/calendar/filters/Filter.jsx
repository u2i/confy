import React from 'react';
import { Checkbox } from 'react-bootstrap';
import ConferenceRoomSchema from 'schemas/ConferenceRoomSchema';

import './filters.scss';

export default class Filter extends React.Component {
  static propTypes = {
    onEnabled:      React.PropTypes.func.isRequired,
    onDisabled:     React.PropTypes.func.isRequired,
    color:          React.PropTypes.string,
    enabled:        React.PropTypes.bool,
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
      this.props.onDisabled();
    } else {
      this.props.onEnabled();
    }
  }

  render() {
    return (
      <div className="filter-box" style={{ backgroundColor: this.props.color }}>
        <Checkbox onChange={this.handleToggle}
                  checked={!this.props.enabled}
                  inline>
          {this.props.children}
        </Checkbox>
      </div>
    );
  }
}
