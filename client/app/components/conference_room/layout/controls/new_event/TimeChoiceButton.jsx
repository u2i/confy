import moment from 'moment';
import React from 'react';
import { instanceOfMoment, instanceOfDuration } from 'proptypes/moment';
import { Button } from 'react-bootstrap';
import { humanizeTime } from 'helpers/DateHelper';

export default class TimeChoiceButton extends React.Component {
  static propTypes = {
    nextEventStart: instanceOfMoment.isRequired,
    duration: instanceOfDuration.isRequired,
    onClick: React.PropTypes.func
  };

  componentDidMount() {
    this.interval = setInterval(this.forceUpdate.bind(this), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <Button bsStyle="primary"
              bsSize="large"
              onClick={() => this.props.onClick(this.props.duration)}
              disabled={!this._timeAvailable()}>
        {humanizeTime(this.props.duration)}
      </Button>
    );
  }

  _timeAvailable() {
    return this.props.nextEventStart.isSameOrAfter(moment().add(this.props.duration));
  }
}
