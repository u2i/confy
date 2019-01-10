import React from 'react';
import { Button } from 'react-native-elements';
import { styles } from '../../../styles/buttons';

const AvailableTimeButton = ({ onClick }) => (
  <Button backgroundColor='blue'
          raised={true}
          large={true}
          textStyle={styles.buttonText}
          containerViewStyle={styles.buttonContainer}
          onPress={() => onClick ? onClick() : null}
          title='Until next event' />
);

export default AvailableTimeButton;
