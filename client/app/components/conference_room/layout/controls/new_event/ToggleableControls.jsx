import React from 'react';
import { Button } from 'react-bootstrap';
import { If, Else } from 'react-if';
import { instanceOfMoment } from 'proptypes/moment';

import eventTimeControls from './EventTimeControls';

export default class ToggleableControls extends React.Component {
  static propTypes = {
    toggleText: React.PropTypes.string.isRequired,
    onCreate: React.PropTypes.func,
    nextEventStart: instanceOfMoment,
    currentEventEnd: instanceOfMoment,
    children: React.PropTypes.node
  };

  static defaultProps = {
    onCreate: () => {
    }
  };

  constructor(...args) {
    super(...args);
    this.state = { showTimeButtons: false };
    this.handleToggle = this.handleToggle.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  handleToggle() {
    this.setState({ showTimeButtons: !this.state.showTimeButtons });
  }

  handleCreate(end) {
    this.handleToggle();
    this.props.onCreate(end);
  }

  render() {
    const { toggleText, nextEventStart, currentEventEnd, children } = this.props;
    return (
      <If condition={this.state.showTimeButtons}>
        <div className="event-controls">
          {eventTimeControls({ nextEventStart, currentEventEnd, onCreate: this.handleCreate })}
          <Button bsSize="large" onClick={this.handleToggle}>Cancel</Button>
        </div>
        <Else>
          <div className="event-controls">
            {children}
            <Button bsStyle="primary" bsSize="large" onClick={this.handleToggle}>{toggleText}</Button>
          </div>
        </Else>
      </If>
    );
  }
}
