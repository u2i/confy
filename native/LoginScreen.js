import React from 'react';
import Expo from 'expo';
import { Text, View, AsyncStorage, Dimensions } from 'react-native';
import { Button, Header, Card } from 'react-native-elements';
import { styles } from './styles/login';

export default class App extends React.Component {
  state = {
    token: null,
    signedIn: false,
    name: '',
    photoUrl: ''
  }

  componentDidMount = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    const dim = Dimensions.get('screen');

    console.log(dim);
  }

  _onPress = async () => {
    try {
      const result = await Expo.Google.logInAsync({
        androidClientId: '659112718098-fal3otr60v785col8phmpdkafnrbn98i.apps.googleusercontent.com',
        iosClientId: '659112718098-nnk3u8cg3pt8dgh0usjibjo2tpqd3klk.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });

      console.log(result);

      if (result.type === 'success') {
        await AsyncStorage.setItem('userToken', result.accessToken);
        await AsyncStorage.setItem('user', JSON.stringify(result.user));

        this.props.navigation.navigate('App');
      } else {
        return { cancelled: true };
      }
    } catch(e) {
      return { error: true };
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <LoginPage signIn={this._onPress} />
      </View>
    );
  }
}

const LoginPage = props => {
  return (
    <View style={{ alignContent: 'center' }}>
      <Button large={true} raised={true} backgroundColor='blue' title="Sign in with Google" onPress={() => props.signIn()} />
    </View>
  )
}
