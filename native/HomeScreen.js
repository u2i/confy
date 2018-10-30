import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, AsyncStorage, Image, Dimensions } from 'react-native';
import { Button, Header, Card, Icon } from 'react-native-elements';
import { createSubscription, removeSubscription } from './cable';
import { styles } from './styles/home';

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
    const dim = Dimensions.get('screen');

    console.log(dim);

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
    removeSubscription();
    this.props.navigation.navigate('Auth');
  }

  _getEvents = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const response = await fetch('http://1e6abe1f.ngrok.io/api/events', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + userToken
      }
    });

    console.log(response);

    if (response.ok) {
      const responseJson = await response.json();
      return responseJson;
    } else {
      return [];
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          statusBarProps={{ barStyle: 'light-content' }}
          rightComponent={<SettingComponent onPress={() => this.props.navigation.navigate('Settings')} />}
          centerComponent={{ text: 'Confy', style: { color: '#fff', fontSize: 20, paddingBottom: 5 } }}
          outerContainerStyles={{ borderBottomWidth: 0, alignSelf: 'stretch', backgroundColor: '#3D6DCC', paddingBottom: 5 }}
        />
        {this.state.token && (
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <LoggedInPage
              name={this.state.name}
              photoUrl={this.state.photoUrl}
            />
            <Card containerStyle={{ flex: 1, margin: 10, marginBottom: 10 }} title="Hello">
            </Card>
          </View>
        )}
      </View>
    );
  }
}

const LoggedInPage = props => {
  return (
    <Card containerStyle={{ backgroundColor: '#EEE', flex: 2, margin: 10, marginBottom: 10, marginRight: 0 }}
          title={props.name}>
      <Image style={styles.image} source={{ uri: props.photoUrl }}/>
    </Card>
  )
}

const SettingComponent = props => {
  return (
    <Icon
      size={40}
      name='menu'
      color='#FFF'
      underlayColor='transparent'
      onPress={props.onPress}
    />
  )
}
