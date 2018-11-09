import moment from 'moment';
import React from 'react';
import { View, Text } from 'react-native';

export default class Clock extends React.Component {
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
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'baseline' }}>
        <Text style={{ color: '#FFF', fontSize: 20, flex:1 }}>{time.format(dateFormat)}</Text>
        <View style={{ flex:1, alignItems: 'flex-end' }}>
          <Text style={{ color: '#FFF', fontSize: 36 }}>{time.format(timeFormat)}</Text>
        </View>
      </View>
    );
  }

  _setTime() {
    this.setState({ time: moment() });
  }
}
