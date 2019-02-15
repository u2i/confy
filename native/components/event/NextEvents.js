import React from 'react';
import { FlatList } from 'react-native';
import { ListItem, Text, Icon } from 'react-native-elements';
import { eventTimeString, eventCreator } from '../../helpers/EventHelper';

export default class NextEvents extends React.Component {
  render() {
    const { events, eventDetails } = this.props;

    if (events.length > 0) {
      return (
        <FlatList
          data={events}
          renderItem={({ item, index }) => (
            <ListItem
              leftIcon={{name: 'event'}}
              title={eventTimeString(item)}
              rightTitle={item.summary}
              rightTitleNumberOfLines={2}
              rightTitleStyle={{fontSize: 18, flex: 1, textAlign: 'right'}}
              titleStyle={{color: '#FFF', fontSize: 18, marginLeft: 0}}
              titleNumberOfLines={2}
              subtitle={`by ${eventCreator(item)}`}
              subtitleNumberOfLines={2}
              subtitleStyle={{fontSize: 14, fontWeight: '100'}}
              onPress={() => eventDetails(item, index)}
              underlayColor='#444'
              rightIcon={{name:'info'}}
            />
          )}
          keyExtractor={(item, index) => `event_${item.id}`}
        />
      )
    } else {
      return (
        <Text style={{ fontSize: 18, alignSelf: 'center', color: '#FFF', marginTop: 10 }}>
          No more events for today
        </Text>
      )
    }
  }
}
