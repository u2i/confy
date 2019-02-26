import React from 'react';
import { FlatList, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { buildAvailabilityProps, sortAvailabilityProps,
         availabilityStatus, availabilityIcon } from '../helpers/AvailabilityHelper';

export default class RoomsAvailability extends React.Component {
  componentDidMount() {
    this.refreshAvailabilityInterval = setInterval(() => this.forceUpdate(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.refreshAvailabilityInterval);
  }

  render() {
    const { events, eventDetails, allConferenceRooms } = this.props;
    const availabilityProps = buildAvailabilityProps(allConferenceRooms, events);
    sortAvailabilityProps(availabilityProps);

    return (
      <FlatList
        data={availabilityProps}
        renderItem={({ item, index }) => (
          <ListItem
            leftIcon={{ name: 'domain' }}
            title={item.conferenceRoom.title}
            titleStyle={{color: '#FFF', fontSize: 18}}
            subtitle={availabilityStatus(item.availability, item.duration)}
            subtitleStyle={{fontSize: 14, fontWeight: '100'}}
            onPress={() => eventDetails(item.currentEvent, index)}
            rightIcon={availabilityIcon(item.availability)}
            underlayColor='#888'
            containerStyle={{ paddingRight:5}}
          />
        )}
        keyExtractor={(item, index) => `room_${item.conferenceRoom.id}`}
      />
    )
  }
}
