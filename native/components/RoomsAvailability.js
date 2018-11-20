import React from 'react';
import { FlatList, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { buildAvailabilityProps, sortAvailabilityProps,
         availabilityStatus, availabilityClass } from '../helpers/AvailabilityHelper';

export default class RoomsAvailability extends React.Component {
  componentDidMount() {
    this.refreshAvailabilityInterval = setInterval(() => this.forceUpdate(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.refreshAvailabilityInterval);
  }

  render() {
    const availabilityProps = buildAvailabilityProps(this.props.allConferenceRooms, this.props.events);
    sortAvailabilityProps(availabilityProps);

    return (
      <FlatList
        data={availabilityProps}
        renderItem={({item}) => (
          <ListItem
            leftIcon={{ name: 'domain' }}
            title={item.conferenceRoom.title}
            titleStyle={{color: '#FFF', fontSize: 18}}
            subtitle={availabilityStatus(item.availability, item.duration)}
            subtitleStyle={{fontSize: 14, fontWeight: '100'}}
            badge={{ textStyle: { color: '#000' },
                     containerStyle: { backgroundColor: availabilityClass(item.availability) }}}
            hideChevron
          />
        )}
        keyExtractor={(item, index) => `room_${item.conferenceRoom.id}`}
      />
    )
  }
}
