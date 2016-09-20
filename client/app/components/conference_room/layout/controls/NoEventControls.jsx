import React from 'react';
import { If, Else } from 'react-if';
import { instanceOfMoment } from 'proptypes/moment';
import { Button } from 'react-bootstrap';
import NewEventControls from './new_event/NewEventControls';

export default class NoEventControls extends React.Component {
  static propTypes = {
    onCreate: React.PropTypes.func,
    nextEventStart: instanceOfMoment
  };

  constructor(...args) {
    super(...args);
    this.state = { showTimeButtons: false };
    this.handleStartClick = this.handleStartClick.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
  }

  handleStartClick() {
    this.setState({ showTimeButtons: true });
  }

  handleCancelClick() {
    this.setState({ showTimeButtons: false });
  }

  render() {
    return (
      <If condition={this.state.showTimeButtons}>
        <NewEventControls nextEventStart={this.props.nextEventStart}
                          onCreate={this.props.onCreate}
                          onCancel={this.handleCancelClick} />
        <Else>
          <div className="event-controls">
            <Button bsStyle="primary" bsSize="large" onClick={this.handleStartClick}>Start</Button>
          </div>
        </Else>
      </If>
    );
  }
}
