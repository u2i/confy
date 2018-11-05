import moment from 'moment';
import React from 'react';
import { Badge } from 'react-native-elements';
import { humanizeTime, isFullNonZeroMinute } from '../helpers/DateHelper';

const FIVE_MINUTES = 60 * 1000 * 5;

export default class TimeProgress extends React.Component {
  static defaultProps = {
    updateInterval: 1000,
    displayEndTimeWarning: () => {},
    onCompleted: () => {}
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
      <Badge textStyle={{fontSize: 40, padding: 10, fontWeight: 'bold' }}
             containerStyle={{backgroundColor: 'green', marginTop: 50}}
             value={`${this.state.timeLeft} ${this.props.suffix || 'left'}`} />
    );
  }

  _humanizedTimeLeft() {
    return humanizeTime(moment.duration(this._timeToEnd()));
  }

  _timeToEnd() {
    return Math.max(this.props.end.diff(moment()), 0);
  }

  _update() {
    const timeToEnd = this._timeToEnd();

    this.setState({ timeLeft: this._humanizedTimeLeft() });
    if (timeToEnd <= 0) {
      this.props.onCompleted();
    }

    if (timeToEnd <= FIVE_MINUTES && isFullNonZeroMinute(timeToEnd, this.props.updateInterval)) {
      this.props.displayEndTimeWarning();
    }
  }
}
