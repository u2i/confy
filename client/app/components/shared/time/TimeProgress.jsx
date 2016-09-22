import moment from 'moment';
import React from 'react';
import { instanceOfMoment } from 'proptypes/moment';

import { humanizeTime, isFullMinute } from 'helpers/DateHelper';

const END_TIME_WARNING_TIMEOUT = 60 * 1000 * 5;

export default class TimeProgress extends React.Component {
  static propTypes = {
    end: instanceOfMoment.isRequired,
    onCompleted: React.PropTypes.func,
    updateInterval: React.PropTypes.number,
    suffix: React.PropTypes.string,
    displayEndTimeWarning: React.PropTypes.func
  };

  static defaultProps = {
    updateInterval: 1000,
    displayEndTimeWarning: () => {}
  };

  constructor(...args) {
    super(...args);
    this.state = { timeLeft: this._humanizedTimeLeft() };
    this._update = this._update.bind(this);
  }

  componentDidMount() {
    this._update();
    this.interval = setInterval(this._update, this.props.updateInterval);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <h1>{`${this.state.timeLeft} ${this.props.suffix || 'left'}`}</h1>
    );
  }

  _humanizedTimeLeft() {
    return humanizeTime(moment.duration(this._timeToEnd()));
  }

  _timeToEnd() {
    return this.props.end.diff(moment());
  }

  _update() {
    const timeToEnd = this._timeToEnd();

    this.setState({ timeLeft: this._humanizedTimeLeft() });
    if (timeToEnd <= 0) {
      this.props.onCompleted();
    }

    if (timeToEnd < END_TIME_WARNING_TIMEOUT && isFullMinute(timeToEnd)) {
      this.props.displayEndTimeWarning();
    }
  }
}
