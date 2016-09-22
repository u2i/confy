import moment from 'moment';
import React from 'react';
import { instanceOfMoment, instanceOfDuration } from 'proptypes/moment';
import { Button } from 'react-bootstrap';
import { humanizeTime } from 'helpers/DateHelper';

export default class TimeChoiceButton extends React.Component {
  static propTypes = {
    nextEventStart: instanceOfMoment,
    duration: instanceOfDuration.isRequired,
    onClick: React.PropTypes.func
  };

  constructor(...args) {
    super(...args);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(this.forceUpdate.bind(this), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleClick() {
    if (this.props.onClick) {
      this.props.onClick(moment().add(this.props.duration));
    }
  }

  render() {
    return (
      <Button bsStyle="primary"
              bsSize="large"
              onClick={this.handleClick}
              disabled={!this._timeAvailable()}>
        {humanizeTime(this.props.duration)}
      </Button>
    );
  }

  _timeAvailable() {
    return !this.props.nextEventStart || this.props.nextEventStart.isSameOrAfter(moment().add(this.props.duration));
  }
}
