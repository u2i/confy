import React from 'react';
import { View, ScrollView } from 'react-native';
import { Badge, Icon, Text } from 'react-native-elements';
import { attendeeName, attendeeClass, attendeeIcon } from '../../helpers/AttendeeHelper';

export default class EventAttendees extends React.Component {
  render() {
    const attendees = this.props.event.attendees.filter(guest => !guest.self);

    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {
          attendees.map((guest, idx) => (
            <Badge key={`guest_${idx}`}
                   containerStyle={{backgroundColor: attendeeClass(guest), margin: 5}}>
              <View style={{flexDirection: 'row'}}>
                <Icon name={attendeeIcon(guest)} color='#FFF' containerStyle={{marginBottom: 0}} />
                <Text style={{fontSize: 16, padding: 5, color: '#FFF'}}>
                  {attendeeName(guest)}
                </Text>
              </View>
            </Badge>
          ))
        }
      </View>
    )
  }
}
