import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Icon, Text, Divider } from 'react-native-elements';
import Modal from 'react-native-modal';
import EventAttendees from './EventAttendees';
import { eventTimeString, eventCreator } from '../../helpers/EventHelper';

export default class EventDetails extends React.Component {
  render() {
    const { event, isVisible, onClose } = this.props;

    if (event) {
      return (
        <Modal isVisible={isVisible}
               animationIn='slideInRight'
               animationOut='slideOutRight'
               backdropOpacity={0.9}>
          <ScrollView style={{flex: 1}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Text h2 style={{flex: 1, marginBottom: 20, color: '#FFF'}}>
                {event.summary}
              </Text>
              <Icon name='close' color='#FFF' size={40} underlayColor='#444'
                    containerStyle={{alignSelf: 'flex-start', alignItems: 'flex-end'}}
                    onPress={onClose}
               />
            </View>
            <Text h4 style={{marginBottom: 10, color: '#FFF'}}>
              {eventTimeString(event)}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, alignItems: 'flex-start'}}>
                <Text style={{fontStyle: 'italic', fontSize: 16, color: '#FFF'}}>
                  {`by ${eventCreator(event)}`}
                </Text>
              </View>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <Text style={{paddingRight: 10, fontSize: 16, color: '#FFF'}}>
                  {event.hangout_link}
                 </Text>
               </View>
            </View>

            <Divider style={{marginTop: 10, marginBottom: 10}} />

            <EventAttendees event={event} />

            <Text style={{marginTop: 10, fontSize: 16, color: '#FFF'}}>
              {event.description}
            </Text>

            <Button large={true}
                    raised={true}
                    icon={{name: 'close'}}
                    backgroundColor='orange'
                    textStyle={{fontSize: 20}}
                    onPress={onClose}
                    containerViewStyle={{marginTop: 20, alignSelf: 'center'}}
                    title='Close'
            />
          </ScrollView>
        </Modal>
      )
    } else {
      return <Modal isVisible={false}><View></View></Modal>
    }
  }
}