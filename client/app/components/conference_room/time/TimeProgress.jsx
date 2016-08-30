import moment from 'moment';
import React from 'react';
import { Circle } from 'react-progressbar.js';
import { formatDuration } from 'helpers/DateHelper';

import './time_progress.scss';

export default class TimeProgress extends React.Component {
  static propTypes = {
    start:          React.PropTypes.number.isRequired,
    end:            React.PropTypes.number.isRequired,
    label:          React.PropTypes.string,
    updateInterval: React.PropTypes.number
  };

  static defaultProps = {
    updateInterval: 1000
  };

  static progressBarOptions = {
    strokeWidth: 4,
    easing:      'bounce',
    trailColor:  '#ddd',
    trailWidth:  1,
    from:        { color: "#ff0000" },
    to:          { color: "#00ff00" },
    step:        function (state, circle) {
      circle.path.setAttribute('stroke', state.color);
    }
  };

  constructor(...args) {
    super(...args);

    this.state = { progress: 0 };
    this._updateProgress = this._updateProgress.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(this._updateProgress, this.props.updateInterval);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <Circle progress={this.state.progress}
              text={`<h1>${formatDuration(this._timeLeft(), 'HH:mm:ss')}</h1>`}
              options={TimeProgress.progressBarOptions}
              initialAnimate={true}
              containerClassName="time-progress"/>
    );
  }

  _updateProgress() {
    const { start, end } = this.props;
    this.setState({ progress: 1 - (moment().unix() - start) / (end - start) });
  }

  _timeLeft() {
    const { start, end } = this.props;
    return moment.duration((end - start) * (this.state.progress), 'seconds');
  }
}
