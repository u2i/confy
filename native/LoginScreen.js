import React from 'react';
import Expo from 'expo';
import { View, AsyncStorage, ActivityIndicator, Dimensions } from 'react-native';
import { Text, Button, Card, Divider, Badge } from 'react-native-elements';
import ApiService from './services/ApiService';
import { styles } from './styles/login';

export default class App extends React.Component {
  state = {
    device: {},
    loading: false,
    pending: false
  }

  componentDidMount = async () => {
    await this.setState({
      device: {
        device_id: Expo.Constants.deviceId,
        device_name: Expo.Constants.deviceName
      }
    });

    console.log(Expo.Constants);
  }

  _onPress = async () => {
    this.setState({ loading: true });

    const response = await ApiService.post('devices', {
      device: this.state.device
    });

    await this.setState({ device: response, loading: false });

    if (response.authorized) {
      await AsyncStorage.setItem('device', JSON.stringify(this.state.device));
      this.props.navigation.navigate('App');
    } else {
      this.setState({ pending: true });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <LoginPage loading={this.state.loading}
                   signIn={this._onPress}
                   pending={this.state.pending}
                   device={this.state.device}
        />
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
              title={`Authorize ${props.device.device_name}`}
              onPress={() => props.signIn()}
      />

      {
        props.pending && (
          <View style={{alignSelf: 'center', marginTop: 20}}>
            <Badge value='Authorization Pending ...' containerStyle={{ backgroundColor: 'red'}} />
            <ActivityIndicator style={{ marginTop: 10 }} color='#000' animating={true} />
          </View>
        )
      }

      <Divider style={{ marginTop: 20, marginBottom: 20 }} />

      <Badge value={props.device.device_id} />
    </Card>
  )
}
