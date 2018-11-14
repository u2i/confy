import React from 'react';
import { Button, Badge } from 'react-native-elements';
import CreateEventControls from '../new_event/CreateEventControls';
import { styles } from '../../../styles/buttons';

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
      textStyle={styles.buttonText}
      containerViewStyle={styles.buttonContainer}
      icon={{name: 'close'}}
      onPress={onFinish}
      title='Finish' />
  </CreateEventControls>
);

export default InProgress;
