import moment from 'moment';
import React from 'react';
import instanceOfMoment from 'proptypes/moment';

import { humanizeTime } from 'helpers/DateHelper';

export default class TimeProgress extends React.Component {
  static propTypes = {
    end: instanceOfMoment.isRequired,
    onCompleted: React.PropTypes.func,
    updateInterval: React.PropTypes.number,
    suffix: React.PropTypes.string
  };

  static defaultProps = {
    updateInterval: 1000
  };

  constructor(...args) {
    super(...args);
    this.state = { timeLeft: this._timeLeft() };
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

  _timeLeft() {
    return humanizeTime(moment.duration(this.props.end.diff(moment())));
  }

  _update() {
    this.setState({ timeLeft: this._timeLeft() });
    if (this.props.onCompleted && this.props.end <= moment()) {
      this.props.onCompleted();
    }
  }
}
