import React from 'react';
import Expo from 'expo';
import { StyleSheet, Text, View, Button, ActivityIndicator, AsyncStorage, Image } from 'react-native';
import { createSubscription } from './Cable';

export default class App extends React.Component {
  state = {
    token: null,
    signedIn: false,
    name: '',
    photoUrl: ''
  }

  componentDidMount = async () => {
    createSubscription();

    const userToken = await AsyncStorage.getItem('userToken');
    const user = JSON.parse(await AsyncStorage.getItem('user'));

    if (user && userToken) {
      this.setState({
        token: userToken,
        name: user.name,
        photoUrl: user.photoUrl
      }, () => {
        this._getEvents();
      });
    }
  }

  _logOut = async () => {
    await AsyncStorage.clear();
    this.setState({
      token: null
    })
  }

  _getEvents = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    fetch('http://1e6abe1f.ngrok.io/events', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + userToken
      }
    })
    .then((response) => response.text())
    .then((quote) => {
      console.log(response);
      alert(response);
    })
    .done();
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
        this.setState({
          name: result.user.name,
          token: result.accessToken,
          photoUrl: result.user.photoUrl
        }, () => {
          this._getEvents();
        });
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
        {this.state.token ? (
          <LoggedInPage
            name={this.state.name}
            photoUrl={this.state.photoUrl}
            signOff={this._logOut}
          />
        ) : (
          <LoginPage signIn={this._onPress} />
        )}

        { !this.state.token && <ActivityIndicator animate={true} /> }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 25
  },
  image: {
    marginTop: 15,
    width: 150,
    height: 150,
    borderColor: "rgba(0,0,0,0.2)",
    borderWidth: 3,
    borderRadius: 10,
    alignSelf: 'center'
  }
});

const LoginPage = props => {
  return (
    <View>
      <Text style={styles.header}>Sign In With Google</Text>
      <Button title="Sign in with Google" onPress={() => props.signIn()} />
    </View>
  )
}

const LoggedInPage = props => {
  return (
    <View>
      <Text style={styles.header}>{props.name}</Text>
      <Image style={styles.image} source={{ uri: props.photoUrl }}/>
      <Button onPress={() => props.signOff()} title="Log out" />
    </View>
  )
}
