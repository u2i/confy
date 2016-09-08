import moment from 'moment';
import React from 'react';

export default class Clock extends React.Component {
  static propTypes = {
    updateInterval: React.PropTypes.number,
    dateFormat: React.PropTypes.string,
    timeFormat: React.PropTypes.string
  };

  static defaultProps = {
    updateInterval: 1000
  };

  constructor(...args) {
    super(...args);

    this.state = { time: moment() };
    this._setTime = this._setTime.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(this._setTime, this.props.updateInterval);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { dateFormat, timeFormat } = this.props;
    const time = this.state.time;
    return (
      <div>
        <p className="clock-date">{time.format(dateFormat)}</p>
        <p className="clock-time">{time.format(timeFormat)}</p>
      </div>
    );
  }

  _setTime() {
    this.setState({ time: moment() });
  }
}
