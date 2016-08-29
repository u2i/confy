import moment from 'moment';
import React from 'react';

export default class Clock extends React.Component {
  static propTypes = {
    updateInterval: React.PropTypes.number,
    format: React.PropTypes.string.isRequired
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
    return (
      <div>
        {this.state.time.format(this.props.format)}
      </div>
    )
  }

  _setTime() {
    this.setState({ time: moment() });
  }
}
