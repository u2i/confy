import moment from 'moment';
import React from 'react';
import { Circle } from 'react-progressbar.js';
import { formatDuration } from 'helpers/DateHelper';

import './time_progress.scss';

export default class TimeProgress extends React.Component {
  static propTypes = {
    start: React.PropTypes.number.isRequired,
    end: React.PropTypes.number.isRequired,
    onCompleted: React.PropTypes.func.isRequired,
    label: React.PropTypes.string,
    updateInterval: React.PropTypes.number,
    animate: React.PropTypes.bool
  };

  static defaultProps = {
    updateInterval: 1000,
    animate: true
  };

  static progressBarOptions = {
    strokeWidth: 4,
    easing: 'bounce',
    trailColor: '#ddd',
    trailWidth: 1,
    from: { color: '#ff0000' },
    to: { color: '#00ff00' },
    step(state, circle) {
      circle.path.setAttribute('stroke', state.color);
    }
  };

  constructor(...args) {
    super(...args);

    this.state = { progress: 0 };
    this._updateProgress = this._updateProgress.bind(this);
  }

  componentDidMount() {
    this._updateProgress();
    this.interval = setInterval(this._updateProgress, this.props.updateInterval);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <Circle progress={this.props.animate ? this.state.progress : 1}
              text={`<h1>${formatDuration(this._timeLeft(), 'HH:mm:ss')}</h1>`}
              initialAnimate
              options={TimeProgress.progressBarOptions}
              containerClassName="time-progress" />
    );
  }

  _updateProgress() {
    const { start, end } = this.props;
    this.setState({ progress: 1 - (moment().unix() - start) / (end - start) }, () => {
      if (this.state.progress <= 0) {
        this.props.onCompleted();
      }
    });
  }

  _timeLeft() {
    const { start, end } = this.props;
    return moment.duration((end - start) * (this.state.progress), 'seconds');
  }
}
