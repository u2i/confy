import moment from 'moment';
import React from 'react';
import { Button } from 'react-native-elements';
import { humanizeTime } from '../../../helpers/DateHelper';

export default class TimeChoiceButton extends React.Component {
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
      this.props.onClick(this._start().add(this.props.duration));
    }
  }

  render() {
    return (
      <Button large={true}
              raised={true}
              backgroundColor='blue'
              onPress={this.handleClick}
              disabled={!this._timeAvailable()}
              textStyle={{fontSize: 20, height: 26, paddingTop: 3}}
              containerViewStyle={{ marginLeft: 5, marginRight: 5 }}
              title={humanizeTime(this.props.duration)} />
    );
  }

  _timeAvailable() {
    return !this.props.nextEventStart || this.props.nextEventStart.isSameOrAfter(this._end());
  }

  _start() {
    return this.props.start || moment();
  }

  _end() {
    return this._start().clone().add(this.props.duration);
  }
}
