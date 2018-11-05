import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import eventTimeControls from './EventTimeControls';

export default class ToggleableControls extends React.Component {
  static defaultProps = {
    onCreate: () => {
    }
  };

  constructor(...args) {
    super(...args);
    this.state = { showTimeButtons: false };
    this.handleToggle = this.handleToggle.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  handleToggle() {
    this.setState({ showTimeButtons: !this.state.showTimeButtons });
  }

  handleCreate(end) {
    this.handleToggle();
    this.props.onCreate(end);
  }

  render() {
    const { toggleText, nextEventStart, currentEventEnd, children } = this.props;

    if (this.state.showTimeButtons) {
      return (
        <View style={{ marginTop: 10, alignSelf: 'center', flexDirection: 'row' }}>
          {eventTimeControls({ nextEventStart, currentEventEnd, onCreate: this.handleCreate })}
          <Button backgroundColor='orange'
                  large={true}
                  raised={true}
                  textStyle={{fontSize: 20}}
                  icon={{name: 'arrow-back'}}
                  onPress={this.handleToggle}
                  containerViewStyle={{ marginLeft: 5, marginRight: 5 }}
                  title='Back' />
        </View>
      )
    } else {
      return (
        <View style={{ marginTop: 10, alignSelf: 'center', flexDirection: 'row' }}>
          {children}
          <Button
            backgroundColor='blue'
            large={true}
            raised={true}
            textStyle={{fontSize: 20}}
            icon={{ name: 'timer' }}
            onPress={this.handleToggle}
            containerViewStyle={{ marginLeft: 5, marginRight: 5 }}
            title={toggleText} />
        </View>
      )
    }
  }
}
