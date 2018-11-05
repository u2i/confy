import React from 'react';
import { Button } from 'react-native-elements';

const AvailableTimeButton = ({ onClick }) => (
  <Button backgroundColor='blue'
          raised={true}
          large={true}
          textStyle={{fontSize: 20}}
          onPress={() => onClick ? onClick() : null}
          containerViewStyle={{ marginLeft: 5, marginRight: 5 }}
          title='Until next event' />
);

export default AvailableTimeButton;
