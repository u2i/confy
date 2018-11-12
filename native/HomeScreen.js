import React from 'react';
import moment from 'moment';
import { StyleSheet, View, ScrollView, ActivityIndicator, AsyncStorage, Image, FlatList } from 'react-native';
import { Button, Header, Card, Icon, ListItem, Text, Divider, Badge } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';
import { createSubscription, removeSubscription } from './cable';
import { currentAndNextEvents, eventTimeString, eventCreator, nextEventStart } from './helpers/EventHelper';
import ApiService from './services/ApiService';
import TimeProgress from './components/TimeProgress';
import Clock from './components/Clock'
import Controls from './components/controls/Controls';
import { styles } from './styles/home';

export default class App extends React.Component {
  state = {
    loading: false,
    nextEvents: [],
    currentRoom: {}
  }

  componentDidMount = async () => {
    createSubscription();
  }

  _logOut = async () => {
    await AsyncStorage.clear();
    removeSubscription();
    this.props.navigation.navigate('Auth');
  }

  _getEvents = async () => {
    const params = {
      start: moment().toISOString(),
      end: moment().endOf('day').toISOString(),
      confirmation: true,
      conference_room_id: this.state.currentRoom.id
    };

    return await ApiService.get('events', params);
  }

  _refreshRoom = async () => {
    const room = JSON.parse(await AsyncStorage.getItem('room'));

    if (room) {
      this.setState({ loading: true, currentRoom: room });

      const data = await this._getEvents();
      const eventsInActiveConferenceRoom = data.filter(event =>
        event.conference_room.id === room.id
      );
      const { current, next } = currentAndNextEvents(eventsInActiveConferenceRoom);

      this.setState({
        loading: false,
        nextEvents: next,
        currentEvent: current,
        allEvents: data
      });

      console.log(current);
    }
  }

  _onFocus = () => {
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
      summary: 'Anonymous event ...'
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
    const apiPath = `events/${eventId}/finish`

    await ApiService.post(apiPath, {
      conference_room_id: roomId
    }, false);

    this._refreshRoom();
  }

  _onExtend = async (event, end) => {
    this.setState({ loading: true });

    const roomId = this.state.currentRoom.id;
    const eventId = this.state.currentEvent.id;
    const apiPath = `events/${eventId}`

    await ApiService.put(apiPath, {
      conference_room_id: roomId,
      event: { end_time: end.format() }
    });

    this._refreshRoom();
  }

  _onConfirm = async (event) => {
    this.setState({ loading: true });

    const roomId = this.state.currentRoom.id;
    const eventId = this.state.currentEvent.id;
    const apiPath = `events/${eventId}/confirm`

    await ApiService.post(apiPath, {
      conference_room_id: roomId
    }, false);

    this._refreshRoom();
  }

  _onCancel = async (event) => {

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
        {this.state.currentRoom && (
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 5, backgroundColor: '#000', padding: 10 }}>
              <View style={{ flex: 3 }}>
                <CurrentEvent event={this.state.currentEvent}
                              eventTimeString={eventTimeString}
                              eventCreator={eventCreator}
                              onCompleted={this._refreshRoom}
                />
              </View>
              <View style={{ height: 80, flexDirection: 'row', alignSelf: 'center' }}>
                {
                  this.state.loading && (
                    <View style={{alignSelf: 'center'}}>
                      <Badge value='Please wait ...' />
                      <ActivityIndicator style={{ margin: 20 }} color='#FFF' size='large' animating={true} />
                    </View>
                  )
                }
                {
                  !this.state.loading && (
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
            <View style={{ flex: 2, backgroundColor: '#222'}}>
              <View style={{ flex: 1}}>
                <View style={{ flex: 1, padding: 10  }}>
                  <Text style={{ fontSize: 20, alignSelf: 'center', color: '#888' }}>Next Events</Text>

                  <Divider style={{ marginTop: 10, marginBottom: 10 }} />
                  <NextEvents
                    events={this.state.nextEvents}
                    eventTimeString={eventTimeString}
                    eventCreator={eventCreator}
                  />
                </View>
                <View style={{ backgroundColor: 'black', height: 70, padding: 10  }}>
                  <Clock dateFormat="MM-DD dddd" timeFormat="HH:mm" />
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const NextEvents = props => {
  if (props.events.length > 0) {
    return (
      <FlatList
        data={props.events}
        renderItem={({item}) => (
          <ListItem
            leftIcon={{ name: 'event' }}
            title={props.eventTimeString(item)}
            rightTitle={item.summary}
            rightTitleNumberOfLines={2}
            titleStyle={{color: '#FFF'}}
            titleNumberOfLines={2}
            subtitle={`by ${props.eventCreator(item)}`}
            subtitleNumberOfLines={2}
            hideChevron
          />
        )}
        keyExtractor={(item, index) => `event_${item.id}`}
      />
    )
  } else {
    return (
      <NoEvent h4 />
    )
  }
}

const attendeeClass = (guest) => {
  const status = guest.response_status;

  if (status === 'needsAction') {
    return 'gray';
  }
  else if (status === 'accepted') {
    return 'green';
  }
  else {
    return 'red';
  }
}

const attendeeIcon = (guest) => {
  const status = guest.response_status;

  if (status === 'needsAction') {
    return 'help';
  }
  else if (status === 'accepted') {
    return 'check-circle';
  }
  else {
    return 'cancel';
  }
}

const EventAttendees = props => {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {
        props.event.attendees.filter(guest => !guest.self).map((guest, idx) => (
          <Badge key={`guest_${idx}`}
                 containerStyle={{backgroundColor: attendeeClass(guest), margin: 5}}>
            <View style={{flexDirection: 'row'}}>
              <Icon name={attendeeIcon(guest)} color='#FFF' containerStyle={{marginBottom: 0}} />
              <Text style={{fontSize: 16, padding: 5, color: '#FFF'}}>
                {guest.display_name || guest.email}
              </Text>
            </View>
          </Badge>
        ))
      }
    </View>
  )
}

const CurrentEvent = props => {
  if (props.event) {
    return (
      <ScrollView>
        <Text h2 style={{ marginBottom: 20, color: '#FFF' }}>{props.event.summary}</Text>
        <Text h4 style={{ marginBottom: 10, color: '#FFF' }}>{props.eventTimeString(props.event)}</Text>
        <View style={{ flexDirection: 'row' }}>
          <View style={{flex: 1, alignItems: 'flex-start'}}>
            <Text style={{ fontStyle: 'italic', fontSize: 16, color: '#FFF' }}>
              {`by ${props.eventCreator(props.event)}`}
            </Text>
          </View>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <Text style={{ paddingRight: 10, fontSize: 16, color: '#FFF' }}>
              { props.event.hangout_link}
             </Text>
           </View>
        </View>

        <Divider style={{ marginTop: 10, marginBottom: 10 }} />

        <EventAttendees event={props.event} />

        <Text style={{ marginTop: 10, fontSize: 16, color: '#FFF' }}>
          {props.event.description}
        </Text>

        <View style={{ alignItems: 'center' }}>
          <TimeProgress
            end={props.event ? moment(props.event.end.date_time) : props.nextEventStart}
            suffix={props.event ? 'left' : 'to next event'}
            onCompleted={props.onCompleted}
          />
        </View>
      </ScrollView>
    )
  } else {
    return (
      <NoEvent h2 />
    )
  }
}

const NoEvent = props => {
  return (
    <Text {...props} style={{ alignSelf: 'center', color: 'red' }}>
      No more events for today
    </Text>
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
