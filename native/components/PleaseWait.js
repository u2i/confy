import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Badge } from 'react-native-elements';

export default class PleaseWait extends React.Component {
  render() {
    return (
      <View style={{alignSelf: 'center'}}>
        <Badge value='Please wait ...' />
        <ActivityIndicator style={{ margin: 20 }} {...this.props} animating={true} />
      </View>
    )
  }
}
