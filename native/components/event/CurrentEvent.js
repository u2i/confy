import React from 'react';
import moment from 'moment';
import { View, ScrollView } from 'react-native';
import { Button, Icon, Text, Divider } from 'react-native-elements';
import EventAttendees from './EventAttendees';
import { eventTimeString, eventCreator } from '../../helpers/EventHelper';
import TimeProgress from '../TimeProgress';

export default class CurrentEvent extends React.Component {
  render() {
    const { event, onCompleted, onCallStart, nextEventStart } = this.props;

    if (event) {
        return (
          <ScrollView>
            <Text h2 style={{ marginBottom: 20, color: '#FFF' }}>{event.summary}</Text>
            <Text h4 style={{ marginBottom: 10, color: '#FFF' }}>{eventTimeString(event)}</Text>
            <View style={{ flexDirection: 'row' }}>
              <View style={{flex: 1, alignItems: 'flex-start'}}>
                <Text style={{ fontStyle: 'italic', fontSize: 16, color: '#FFF' }}>
                  {`by ${eventCreator(event)}`}
                </Text>
              </View>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                { event.hangout_link &&
                  <Button raised={true}
                          onPress={() => { onCallStart(event.id, event.hangout_link) } }
                          icon={{name: 'call'}}
                          backgroundColor='violet'
                          containerViewStyle={{marginRight: 0}}
                          title='Start'
                  />
                }
               </View>
            </View>

            <Divider style={{ marginTop: 10, marginBottom: 10 }} />

            <EventAttendees event={event} />

            <Text style={{ marginTop: 10, fontSize: 16, color: '#FFF' }}>
              {event.description}
            </Text>

            <View style={{ alignItems: 'center' }}>
              <TimeProgress
                end={event ? moment(event.end.date_time) : nextEventStart}
                suffix={event ? 'left' : 'to next event'}
                onCompleted={onCompleted}
              />
            </View>
          </ScrollView>
        )
      } else if (nextEventStart) {
        return (
          <View style={{flex: 1, alignItems: 'center', alignSelf: 'center'}}>
            <Text style={{flex: 1, fontSize: 24, alignSelf: 'center', color: '#FFF', marginTop: 40}}>
              No event currently in progress
            </Text>
            <View style={{flex: 2}}>
              <TimeProgress
                end={nextEventStart}
                suffix={'to next event'}
                onCompleted={onCompleted}
              />
            </View>
          </View>
        )
      } else {
        return (
          <NoEvent h2 />
        )
      }
  }
}

const NoEvent = props => {
  return (
    <Text {...props} style={{ alignSelf: 'center', color: 'red', marginTop: 20 }}>
      No more events for today
    </Text>
  )
}
