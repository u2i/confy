import React from 'react';
import { AsyncStorage, View, FlatList, Text, ActivityIndicator } from 'react-native';
import { Button, Header, Card, Icon, ListItem, Divider, Badge } from 'react-native-elements';
import ApiService from './services/ApiService';
import { styles } from './styles/home';

export default class App extends React.Component {
  state = {
    room: {},
    device: {},
    data: [],
    refreshing: false
  }

  componentDidMount = async () => {
    const room = JSON.parse(await AsyncStorage.getItem('room'));
    const device = JSON.parse(await AsyncStorage.getItem('device'));

    this.setState({
      room: (room || {}),
      device: device,
      confirm: false
    });

    this._loadRooms();
  }

  _logOut = async () => {
    await AsyncStorage.clear();

    this.props.navigation.navigate('Auth');
  }

  _handlePress = async (item) => {
    await AsyncStorage.setItem('room', JSON.stringify(item));

    this.setState({
      room: item,
      confirm: true,
    });
  }

  _loadRooms = async () => {
    await this.setState({ refreshing: true });

    const userToken = await AsyncStorage.getItem('userToken');
    const response = await ApiService.get('conference_rooms')

    this.setState({
      refreshing: false,
      data: response
    });
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
          <View style={{ flex: 1 }}>
            <Card titleStyle={{ fontSize: 20 }}
                  containerStyle={{ flex: 1, margin: 10, marginBottom: 10 }}
                  title='Selected Room'>
              <Badge value={this.state.room.title || '-'}
                     textStyle={{ fontSize: 20, color: '#000', padding: 10 }}
                     containerStyle={{ backgroundColor: this.state.room.color, marginBottom: 10 }} />
              <Button large={true}
                      raised={true}
                      backgroundColor='green'
                      icon={{name: 'check'}}
                      disabled={!this.state.confirm}
                      textStyle={{fontSize: 20}}
                      onPress={() => this.props.navigation.goBack()}
                      title='Confirm' />
            </Card>

            <Card titleStyle={{ fontSize: 20 }}
                  containerStyle={{ flex: 1, margin: 10, marginTop: 0, marginBottom: 10 }}
                  title='Device Info'>

              <Badge value={this.state.device.id}
                     textStyle={{ fontSize: 14, color: '#000', padding: 10 }}
                     containerStyle={{ backgroundColor: 'orange', marginBottom: 10 }} />

              <Button large={true}
                      raised={true}
                      backgroundColor='red'
                      icon={{ name: 'adjust' }}
                      textStyle={{fontSize: 20}}
                      onPress={this._logOut}
                      title='Log out' />
            </Card>
          </View>
          <Card titleStyle={{ fontSize: 20 }}
                containerStyle={{ flex: 1, margin: 10, marginBottom: 10, marginLeft: 0 }}
                title='Conference Rooms'>
            {
              this.state.refreshing && (
                <View style={{alignSelf: 'center'}}>
                  <Badge value='Please wait ...' />
                  <ActivityIndicator style={{ margin: 20 }} size='large' animating={true} />
                </View>
              )
            }
            <FlatList
              style={{ paddingBottom: 10, marginBottom: 50 }}
              data={this.state.data}
              renderItem={({item}) => (
                <ListItem
                  title={item.title}
                  hideChevron
                  leftIcon={ item.id === this.state.room.id ? { name: 'check' } : {} }
                  badge={{ value: item.capacity, textStyle: { color: '#000' }, containerStyle: { backgroundColor: item.color }}}
                  onPress={() => this._handlePress(item)}
                />
              )}
              keyExtractor={(item, index) => `room_${item.id}`}
            />
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
