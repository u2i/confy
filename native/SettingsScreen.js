import React from 'react';
import { AsyncStorage, View } from 'react-native';
import { Button, Header, Card, Icon } from 'react-native-elements';
import { styles } from './styles/home';

export default class App extends React.Component {
  componentDidMount = async () => {
  }

  _logOut = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          statusBarProps={{ barStyle: 'light-content', animated: false }}
          leftComponent={<BackComponent onPress={() => this.props.navigation.goBack()} />}
          centerComponent={{ text: 'Settings', style: { color: '#fff', fontSize: 20, paddingBottom: 5 } }}
          outerContainerStyles={{ borderBottomWidth: 0, alignSelf: 'stretch', backgroundColor: '#3D6DCC', paddingBottom: 5 }}
        />
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Card containerStyle={{ flex: 1, margin: 10, marginBottom: 10 }} title="Hello">
            <Button large={true} raised={true} backgroundColor='red' onPress={this._logOut} title="Log out" />
          </Card>
        </View>
      </View>
    );
  }
}

const BackComponent = props => {
  return (
    <Icon
      size={40}
      name='arrow-back'
      color='#FFF'
      underlayColor='transparent'
      onPress={props.onPress}
    />
  )
}
