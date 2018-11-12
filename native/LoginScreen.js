import React from 'react';
import Expo from 'expo';
import { View, AsyncStorage, Dimensions } from 'react-native';
import { Text, Button, Card, Divider, Badge } from 'react-native-elements';
import { styles } from './styles/login';

export default class App extends React.Component {
  state = {
    device: {},
    loading: false
  }

  componentDidMount = async () => {
    await this.setState({
      device: {
        id: Expo.Constants.deviceId,
        name: Expo.Constants.deviceName,
        class: Expo.Constants.deviceYearClass
      }
    });

    console.log(this.state.device);
  }

  _onPress = async () => {
    this.setState({ loading: true });


    if (true) {
      await this.setState({ loading: false });
      await AsyncStorage.setItem('device', JSON.stringify(this.state.device));

      this.props.navigation.navigate('App');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <LoginPage loading={this.state.loading} signIn={this._onPress} device={this.state.device} />
      </View>
    );
  }
}

const LoginPage = props => {
  return (
    <Card>
      <Text h3 style={{ alignSelf: 'center' }}>Confy Login</Text>

      <Divider style={{ marginTop: 20, marginBottom: 20 }} />

      <Button large={true}
              raised={true}
              backgroundColor='blue'
              loading={props.loading}
              fontSize={20}
              rightIcon={{ name: 'security' }}
              title={`Authorize ${props.device.name}`}
              onPress={() => props.signIn()}
      />

      <Divider style={{ marginTop: 20, marginBottom: 20 }} />

      <Badge value={props.device.id} />
    </Card>
  )
}
