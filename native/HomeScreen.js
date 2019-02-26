import React from 'react';
import moment from 'moment';
import { StyleSheet, View, ScrollView, ActivityIndicator, AsyncStorage, Image, FlatList } from 'react-native';
import { Button, Header, Card, Icon, ListItem, Text, Divider, Badge } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';
import { currentAndNextEvents, eventTimeString, eventCreator, nextEventStart } from './helpers/EventHelper';
import { createSubscription, removeSubscription } from './services/Cable';
import ApiService from './services/ApiService';
import PleaseWait  from './components/PleaseWait';
import RoomsAvailability from './components/RoomsAvailability';
import TimeProgress from './components/TimeProgress';
import Clock from './components/Clock'
import Controls from './components/controls/Controls';
import EventDetails from './components/event/EventDetails';
import EventAttendees from './components/event/EventAttendees';
import CurrentEvent from './components/event/CurrentEvent';
import NextEvents from './components/event/NextEvents';
import { styles } from './styles/home';

export default class App extends React.Component {
  state = {
    loading: false,
    showModal: false,
    allRooms: [],
    allEvents: [],
    nextEvents: [],
    currentRoom: {},
  }

  componentDidMount = async () => {
    createSubscription(this._handleChanges);
    this._needToRefresh();
    this.interval = setInterval(() => { this._needToRefresh() }, 1000 * 60);
  }

  componentWillUnmount = () => {
    removeSubscription();

    clearInterval(this.interval);
    clearTimeout(this.timeout);
  }

  _handleChanges = (value) => {
    const roomId = value.conference_room_id;

    if (roomId === this.state.currentRoom.id) {
      this._refreshRoom();
    }
  }

  _needToRefresh = () => {
    const now = moment();
    const tomorrow = now.clone().add(1, 'day').startOf('day');

    if (now.clone().add(1, 'minute').isAfter(tomorrow)) {
      const timeToTomorrow = tomorrow - now;
      this.timeout = setTimeout(() => { this._refreshRoom() }, timeToTomorrow + 1000 * 10);
    }
  }

  _getEvents = async () => {
    const params = {
      start: moment().toISOString(),
      end: moment().endOf('day').toISOString(),
      confirmation: true
    };

    return await ApiService.get('events', params);
  }

  _refreshRoom = async () => {
    const room = JSON.parse(await AsyncStorage.getItem('room'));

    if (room) {
      this.setState({ loading: true, currentRoom: room });

      const rooms = await ApiService.get('conference_rooms')
      const data = await this._getEvents();

      const eventsInActiveConferenceRoom = data.filter(event =>
        event.conference_room.id === room.id
      );
      const { current, next } = currentAndNextEvents(eventsInActiveConferenceRoom);

      this.setState({
        loading: false,
        nextEvents: next,
        currentEvent: current,
        allRooms: rooms,
        allEvents: data
      });
    }
  }

  _onFocus = async () => {
    this._refreshRoom();
  }

  _nextEventStart = () => {
    return nextEventStart(this.state.nextEvents);
  }

  _onCreate = async (end) => {
    this.setState({ loading: true });

    const roomId = this.state.currentRoom.id;

    const eventParams = {
      start_time: moment().format(),
      end_time: end.format(),
      confirmed: true,
      conference_room_id: roomId,
      summary: 'Anonymous event created by Confy'
    };

    const params = {
      conference_room_id: roomId,
      event: eventParams
    };

    const response = await ApiService.post('events', params);

    this.setState({
      loading: false,
      currentEvent: response
    });
  }

  _onFinish = async () => {
    this.setState({ loading: true });

    const roomId = this.state.currentRoom.id;
    const eventId = this.state.currentEvent.id;

    await ApiService.post(`events/${eventId}/finish`, {
      conference_room_id: roomId
    });

    this._refreshRoom();
  }

  _onExtend = async (event, end) => {
    this.setState({ loading: true });

    const roomId = this.state.currentRoom.id;
    const eventId = this.state.currentEvent.id;

    await ApiService.put(`events/${eventId}`, {
      conference_room_id: roomId,
      event: { end_time: end.format() }
    });

    this._refreshRoom();
  }

  _startNow = async (event) => {
    this.setState({ loading: true });

    const roomId = this.state.currentRoom.id;
    const eventId = event.id;
    const now = moment();

    await ApiService.put(`events/${eventId}`, {
      conference_room_id: roomId,
      event: { start_time: now.format() }
    });

    this._refreshRoom();
  }

  _onConfirm = async (event) => {
    this.setState({ loading: true });

    const roomId = this.state.currentRoom.id;
    const eventId = this.state.currentEvent.id;

    await ApiService.post(`events/${eventId}/confirm`, {
      conference_room_id: roomId
    });

    this._refreshRoom();
  }

  _onCancel = async (event) => {
    this.setState({ loading: true });

    const roomId = this.state.currentRoom.id;
    const eventId = this.state.currentEvent.id;

    await ApiService.post(`events/${eventId}/finish`, {
      conference_room_id: roomId
    });

    this._refreshRoom();
  }

  _closeModal = () => {
    this.setState({
      showModal: false
    });
  }

  _startCall = async (eventId, link) => {
    const roomId = this.state.currentRoom.id;

    const response = await ApiService.post('calls', {
      conference_room_id: roomId,
      call: {
        link: link,
        event_id: eventId,
        active: true
      }
    });
  }

  _eventDetails = (event, index) => {
    this.setState({
      allowStartNow: !this.state.currentEvent && index === 0,
      eventInfo: event,
      showModal: true
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={(payload) => this._onFocus(payload)} />
        <Header
          statusBarProps={{ barStyle: 'light-content' }}
          leftComponent={<RefreshComponent onPress={this._refreshRoom} />}
          rightComponent={<SettingComponent onPress={() => this.props.navigation.navigate('Settings')} />}
          centerComponent={{ text: this.state.currentRoom.title, style: { color: '#fff', fontSize: 40, paddingBottom: 5 } }}
          outerContainerStyles={{ height: 80, borderBottomWidth: 0, alignSelf: 'stretch', backgroundColor: '#3D6DCC', paddingBottom: 5 }}
        />
        <EventDetails isVisible={this.state.showModal}
                      event={this.state.eventInfo}
                      allowStartNow={this.state.allowStartNow}
                      onClose={this._closeModal}
                      onStartNow={this._startNow}
        />
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 2, backgroundColor: '#000', padding: 10 }}>
            <View style={{ flex: 3 }}>
              {
                this.state.currentRoom.id && (
                  <CurrentEvent event={this.state.currentEvent}
                                nextEventStart={this._nextEventStart()}
                                onCallStart={this._startCall}
                                onCompleted={this._refreshRoom}
                  />
                )
              }
              {
                !this.state.currentRoom.id && (
                  <NoRoom onPress={() => this.props.navigation.navigate('Settings')}
                          style={{ fontSize: 40, color: 'yellow', marginTop: 20, alignSelf: 'center' }} />
                )
              }
            </View>
            <View style={{ height: 80, flexDirection: 'row', alignSelf: 'center' }}>
              {
                this.state.loading && <PleaseWait color='#FFF' size='large' />
              }
              {
                (!this.state.loading && this.state.currentRoom.id) && (
                  <Controls event={this.state.currentEvent}
                            nextEventStart={this._nextEventStart()}
                            onCreate={this._onCreate}
                            onCancel={this._onCancel}
                            onConfirm={this._onConfirm}
                            onFinish={this._onFinish}
                            onExtend={this._onExtend}
                  />
                )
               }
            </View>
          </View>
          <View style={{ flex: 1, backgroundColor: '#222' }}>
            <View style={{ flex: 1}}>
              <View style={{ flex: 2, padding: 10 }}>
                <Text style={{ fontSize: 20, alignSelf: 'center', color: '#888' }}>
                  Next Events
                </Text>

                <Divider style={{ marginTop: 10, marginBottom: 10, backgroundColor: '#888' }} />

                <NextEvents events={this.state.nextEvents}
                            eventDetails={this._eventDetails}
                />
              </View>
              {
                this.state.currentEvent && (
                  <View style={{ flex: 1, padding: 10 }}>
                    <Text style={{ fontSize: 20, alignSelf: 'center', color: '#888' }}>
                      Available Rooms
                    </Text>

                    <Divider style={{ marginTop: 10, marginBottom: 10, backgroundColor: '#888' }} />

                    <RoomsAvailability events={this.state.allEvents}
                                       eventDetails={this._eventDetails}
                                       allConferenceRooms={this.state.allRooms} />
                  </View>
                )
              }
              <View style={{ backgroundColor: '#000', height: 70, padding: 10  }}>
                <Clock dateFormat='MM-DD dddd' timeFormat='HH:mm' />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const NoRoom = props => {
  return (
    <View>
      <Text style={props.style}>
        Please select a conference room !!!
      </Text>

      <Button large={true}
              raised={true}
              onPress={props.onPress}
              icon={{name: 'settings'}}
              backgroundColor='blue'
              textStyle={{fontSize: 20}}
              containerViewStyle={{marginTop: 20, alignSelf: 'center'}}
              title='Settings'
      />
    </View>
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

const RefreshComponent = props => {
  return (
    <Icon
      size={40}
      name='refresh'
      color='#FFF'
      underlayColor='transparent'
      onPress={props.onPress}
    />
  )
}
