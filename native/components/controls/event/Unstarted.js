import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';

const Unstarted = ({ onConfirm, onCancel }) => {
  return(
    <View style={{ marginTop: 10, alignSelf: 'center', flexDirection: 'row' }}>
      <Button
        backgroundColor='blue'
        large={true}
        raised={true}
        textStyle={{fontSize: 20}}
        onPress={onConfirm}
        icon={{name: 'check'}}
        containerViewStyle={{ marginLeft: 5, marginRight: 5 }}
        title='Confirm'
      />
      <Button
        backgroundColor='red'
        large={true}
        raised={true}
        textStyle={{fontSize: 20}}
        onPress={onCancel}
        icon={{name: 'close'}}
        containerViewStyle={{ marginLeft: 5, marginRight: 5 }}
        title='Cancel'
      />
    </View>
  )
}

export default Unstarted;
