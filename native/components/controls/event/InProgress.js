import React from 'react';
import { Button, Badge } from 'react-native-elements';
import CreateEventControls from '../new_event/CreateEventControls';

const InProgress = ({ nextEventStart, currentEventEnd, onFinish, onExtend }) => (
  <CreateEventControls toggleText='Extend'
                       onCreate={onExtend}
                       nextEventStart={nextEventStart}
                       currentEventEnd={currentEventEnd}>
    <Badge value='Confirmed!'
           wrapperStyle={{ alignSelf: 'center', marginRight: 20 }}
           textStyle={{ fontSize: 20, padding: 5, color: 'orange' }} />
    <Button
      backgroundColor='red'
      large={true}
      raised={true}
      textStyle={{fontSize: 20}}
      icon={{name: 'close'}}
      containerViewStyle={{ marginLeft: 5, marginRight: 5 }}
      onPress={onFinish}
      title='Finish' />
  </CreateEventControls>
);

export default InProgress;
