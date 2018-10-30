import React from 'react';
import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import { ActivityIndicator, AsyncStorage, StyleSheet, SafeAreaView, Easing, Animated } from 'react-native';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import SettingsScreen from './SettingsScreen'

class AuthLoadingScreen extends React.Component {
  static navigationOptions = {
    title: 'Loading ...',
  };

  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }
}

const AuthStack = createStackNavigator(
  {
    SignIn: LoginScreen
  }, {
    headerMode: 'none'
  }
);

const ModalNavigator = createStackNavigator(
  {
    Home: { screen: HomeScreen },
    Settings: { screen: SettingsScreen },
  }, {
    headerMode: 'none'
  }
);

export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: ModalNavigator ,
    Auth: AuthStack
  }, {
    initialRouteName: 'AuthLoading',
	}
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6a51ae',
  },
});
