import React from 'react';
import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import { AsyncStorage, StyleSheet, SafeAreaView, View } from 'react-native';
import { Badge } from 'react-native-elements';
import PleaseWait  from './components/PleaseWait';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import SettingsScreen from './SettingsScreen'

class AuthLoadingScreen extends React.Component {
  static navigationOptions = {
    title: 'Loading ...',
  };

  constructor(...props) {
    super(...props);
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    const device = await AsyncStorage.getItem('device');
    this.props.navigation.navigate(device ? 'App' : 'Auth');
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center'}}>
          <PleaseWait size='large' />
        </View>
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
    alignItems: 'center',
    backgroundColor: '#000',
  },
});
